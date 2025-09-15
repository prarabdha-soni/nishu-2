# Nishu AI Interview System

A clean, intelligent AI-powered interview system built with Chatterbox and FastAPI.

## Features

- 🤖 **Chatterbox AI Interview Bot** - Intelligent conversational AI for interviews
- 📝 **Smart Question Generation** - Context-aware interview questions
- 📊 **Response Analysis** - Real-time analysis of candidate responses
- 💾 **Session Management** - Track interview progress and history
- 🎯 **Clean Architecture** - Well-organized, maintainable codebase

## Quick Start

1. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Start the Server**
   ```bash
   python -m uvicorn src.api.app:app --host 0.0.0.0 --port 8000 --reload
   ```

3. **Access the API**
   - API Documentation: http://localhost:8000/docs
   - Health Check: http://localhost:8000/health
   - System Status: http://localhost:8000/api/v1/system/status

## API Endpoints

### Core Endpoints
- `POST /api/v1/interviews/start` - Start a new interview
- `POST /api/v1/interviews/chat` - Chat with the AI interviewer
- `GET /api/v1/interviews/{session_id}/summary` - Get interview summary
- `GET /api/v1/interviews/{session_id}/conversation` - Get conversation history

### System Endpoints
- `GET /api/v1/system/status` - Get system status
- `POST /api/v1/system/cleanup` - Clean up expired sessions

## Project Structure

```
ai-interview-system/
├── src/
│   ├── api/
│   │   └── app.py              # FastAPI application
│   ├── core/
│   │   ├── chatbot.py          # Chatterbox AI implementation
│   │   └── session_manager.py  # Session management
│   └── utils/
│       └── logger.py           # Logging utilities
├── data/
│   └── samples/                # Sample data files
├── logs/                       # Application logs
├── recordings/                 # Audio recordings (if needed)
├── requirements.txt            # Python dependencies
└── README.md                   # This file
```

## Usage Example

### Start an Interview
```python
import requests

# Start interview
response = requests.post("http://localhost:8000/api/v1/interviews/start", json={
    "candidate_name": "John Doe",
    "position_applied": "Software Engineer",
    "resume_text": "Python developer with 5 years experience...",
    "job_description": "Looking for a senior Python developer..."
})

session_id = response.json()["session_id"]
```

### Chat with AI Interviewer
```python
# Send message to AI interviewer
response = requests.post("http://localhost:8000/api/v1/interviews/chat", json={
    "session_id": session_id,
    "message": "I have 5 years of experience with Python and React"
})

ai_response = response.json()["response"]
next_question = response.json()["next_question"]
```

## System Requirements

- Python 3.8+
- SQLite (for Chatterbox database)
- 2GB RAM minimum
- 1GB disk space

## Development

The system is built with:
- **FastAPI** - Modern, fast web framework
- **Chatterbox** - Conversational AI library
- **SQLite** - Lightweight database for session storage
- **Pydantic** - Data validation and serialization

## Model Training (Fine-tuning and RLHF)

Minimal scaffolds are provided to populate `models/fine_tuned`, `models/rlhf`, and `models/training_data`:

- Training data schema: `models/training_data/schema.json`
- Sample conversations: `models/training_data/sample_conversations.jsonl`

### Fine-tune DistilGPT2 (causal LM)
```bash
python src/models/finetune_distilgpt2.py \
  --data models/training_data/sample_conversations.jsonl \
  --model distilgpt2 \
  --output_dir models/fine_tuned \
  --epochs 1 --batch_size 2 --lr 5e-5 --max_length 512
```
Outputs are saved under `models/fine_tuned/distilgpt2-finetuned-<timestamp>`.

### RLHF scaffolds
1) Prepare preference data (toy heuristic):
```bash
python src/models/rlhf_prep_preferences.py \
  --input models/training_data/sample_conversations.jsonl \
  --output models/rlhf/preferences.jsonl
```

2) Train a simple reward model:
```bash
python src/models/rlhf_train_reward_model.py \
  --prefs models/rlhf/preferences.jsonl \
  --out_dir models/rlhf \
  --epochs 1 --batch_size 4 --lr 2e-5
```
Saves to `models/rlhf/reward_model-<timestamp>`.

3) Run PPO scaffold (non-functional demo, generates samples and saves artifacts):
```bash
python src/models/rlhf_ppo_train.py \
  --data models/training_data/sample_conversations.jsonl \
  --policy distilgpt2 \
  --out_dir models/rlhf
```
Artifacts saved under `models/rlhf/ppo-<timestamp>`.

Note: These scripts are minimal examples for structure only and not production-ready training pipelines.

## License

MIT License - see LICENSE file for details.
