#!/bin/bash

# JobX AI Interview Platform - Startup Script
# Zero-cost AI infrastructure startup

echo "🚀 Starting JobX AI Interview Platform..."
echo "💰 Cost: \$0/month - Completely Free!"
echo ""

# Check if Redis is running
if ! redis-cli ping > /dev/null 2>&1; then
    echo "⚠️  Redis not running. Starting Redis..."
    redis-server --daemonize yes
    sleep 2
fi

# Check if Ollama is running
if ! curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo "⚠️  Ollama not running. Starting Ollama..."
    ollama serve &
    sleep 5
fi

# Start backend
echo "🔧 Starting Backend (FastAPI + Ollama + Whisper + Edge-TTS)..."
cd backend
python main.py &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start frontend
echo "🌐 Starting Frontend (React)..."
cd ../frontend
npm start &
FRONTEND_PID=$!

echo ""
echo "✅ JobX AI Platform is running!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:8000"
echo "📚 API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user interrupt
trap "echo '🛑 Stopping services...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
