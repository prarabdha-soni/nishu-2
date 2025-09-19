class STTService {
  constructor() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.available = !!SpeechRecognition;
    this.recognition = this.available ? new SpeechRecognition() : null;
    this.isListening = false;
    this.onResult = null; // ({ transcript, isFinal })
    this.onError = null; // (error)

    if (this.recognition) {
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
          } else {
            interimTranscript += result[0].transcript;
          }
        }
        if (this.onResult) {
          if (interimTranscript) this.onResult({ transcript: interimTranscript, isFinal: false });
          if (finalTranscript) this.onResult({ transcript: finalTranscript, isFinal: true });
        }
      };

      this.recognition.onerror = (e) => {
        console.error('Speech Recognition Error:', e);
        this.isListening = false;
        if (this.onError) this.onError(e);
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };
    }
  }

  start() {
    if (!this.available || this.isListening) return false;
    try {
      // Add a small delay to prevent rapid start/stop issues
      setTimeout(() => {
        if (this.recognition && !this.isListening) {
          this.recognition.start();
          this.isListening = true;
        }
      }, 100);
      return true;
    } catch (e) {
      console.error('Failed to start speech recognition:', e);
      if (this.onError) this.onError(e);
      return false;
    }
  }

  stop() {
    if (!this.available || !this.isListening) return false;
    try {
      this.recognition.stop();
      this.isListening = false;
      return true;
    } catch (e) {
      if (this.onError) this.onError(e);
      return false;
    }
  }

  setCallbacks({ onResult, onError }) {
    this.onResult = onResult;
    this.onError = onError;
  }
}

export const sttService = new STTService(); 