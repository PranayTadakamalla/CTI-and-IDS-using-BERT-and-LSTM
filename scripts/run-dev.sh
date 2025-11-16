#!/bin/bash

echo "Starting CTI-IDS Framework (Development Mode)"
echo "=============================================="

# Terminal colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Start backend
echo -e "${YELLOW}Starting Backend...${NC}"
cd backend || exit 1
source venv/bin/activate
python main.py &
BACKEND_PID=$!
cd ..

# Give backend time to start
sleep 2

# Start frontend
echo -e "${YELLOW}Starting Frontend...${NC}"
npm run dev &
FRONTEND_PID=$!

echo -e "${GREEN}Both services started!${NC}"
echo -e "Frontend: http://localhost:3000"
echo -e "Backend:  http://localhost:8000"
echo -e "Backend Docs: http://localhost:8000/docs"

# Handle shutdown
trap "kill $BACKEND_PID $FRONTEND_PID" EXIT

wait
