#!/bin/bash

# AI Interview System Setup Script

echo "🚀 Setting up AI Interview System..."

# Create virtual environment
echo "📦 Creating virtual environment..."
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
echo "📥 Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Download spaCy model
echo "🧠 Downloading spaCy model..."
python -m spacy download en_core_web_sm

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p logs recordings data/raw data/processed data/annotated data/external
mkdir -p models/base models/fine_tuned models/rlhf models/checkpoints models/training_data

# Install frontend dependencies
echo "🎨 Installing frontend dependencies..."
cd frontend
npm install --legacy-peer-deps
cd ..

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "⚙️ Creating .env file..."
    cat > .env << EOL
# AI Interview System Environment Variables

# OpenAI API Key (optional)
OPENAI_API_KEY=your_openai_api_key_here

# Anthropic API Key (optional)
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0

# API Configuration
API_HOST=0.0.0.0
API_PORT=8000

# Logging
LOG_LEVEL=INFO
EOL
fi

echo "✅ Setup complete!"
echo ""
echo "To start the system:"
echo "1. Backend: source venv/bin/activate && python src/api/app.py"
echo "2. Frontend: cd frontend && npm start"
echo ""
echo "The system will be available at:"
echo "- Backend API: http://localhost:8000"
echo "- Frontend: http://localhost:3000"
echo "- API Docs: http://localhost:8000/docs"
