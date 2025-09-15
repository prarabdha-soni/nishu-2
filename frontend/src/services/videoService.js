class VideoService {
  constructor() {
    this.mediaRecorder = null;
    this.videoChunks = [];
    this.stream = null;
  }

  async startRecording(videoElement) {
    try {
      this.videoChunks = [];
      
      // Get user media
      this.stream = await navigator.mediaDevices.getUserMedia({ 
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });

      // Set video element source
      if (videoElement) {
        videoElement.srcObject = this.stream;
      }

      // Create MediaRecorder
      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: 'video/webm;codecs=vp9,opus'
      });

      // Handle data available
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.videoChunks.push(event.data);
        }
      };

      // Start recording
      this.mediaRecorder.start(1000); // Collect data every second

      return true;
    } catch (error) {
      console.error('Error starting video recording:', error);
      throw new Error('Failed to start video recording');
    }
  }

  async stopRecording() {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
        reject(new Error('No active recording'));
        return;
      }

      this.mediaRecorder.onstop = () => {
        // Create blob from chunks
        const videoBlob = new Blob(this.videoChunks, { 
          type: 'video/webm;codecs=vp9,opus' 
        });
        
        // Stop all tracks
        if (this.stream) {
          this.stream.getTracks().forEach(track => track.stop());
        }

        resolve(videoBlob);
      };

      this.mediaRecorder.stop();
    });
  }

  async pauseRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.pause();
    }
  }

  async resumeRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state === 'paused') {
      this.mediaRecorder.resume();
    }
  }

  isRecording() {
    return this.mediaRecorder && this.mediaRecorder.state === 'recording';
  }

  isPaused() {
    return this.mediaRecorder && this.mediaRecorder.state === 'paused';
  }

  getRecordingState() {
    return this.mediaRecorder ? this.mediaRecorder.state : 'inactive';
  }

  // Get video stream for preview
  async getVideoStream() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ 
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        }
      });
      return this.stream;
    } catch (error) {
      console.error('Error getting video stream:', error);
      throw new Error('Failed to get video stream');
    }
  }

  // Stop video stream
  stopVideoStream() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }

  // Capture frame for emotion analysis
  async captureFrame(videoElement) {
    if (!videoElement || !this.stream) {
      throw new Error('No video element or stream available');
    }

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    
    context.drawImage(videoElement, 0, 0);
    
    return new Promise((resolve) => {
      canvas.toBlob(resolve, 'image/jpeg', 0.8);
    });
  }
}

export const videoService = new VideoService();
