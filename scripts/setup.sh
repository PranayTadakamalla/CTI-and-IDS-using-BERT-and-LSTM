#!/bin/bash

echo "CTI-IDS Framework Setup Script"
echo "=============================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is not installed${NC}"
    exit 1
else
    echo -e "${GREEN}Node.js found:${NC} $(node --version)"
fi

# Check Python
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}Python3 is not installed${NC}"
    exit 1
else
    echo -e "${GREEN}Python3 found:${NC} $(python3 --version)"
fi

# Setup Frontend
echo -e "\n${YELLOW}Setting up Frontend...${NC}"
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}Frontend dependencies installed${NC}"
else
    echo -e "${RED}Failed to install frontend dependencies${NC}"
    exit 1
fi

# Setup Backend
echo -e "\n${YELLOW}Setting up Backend...${NC}"
cd backend || exit 1

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt
if [ $? -eq 0 ]; then
    echo -e "${GREEN}Backend dependencies installed${NC}"
else
    echo -e "${RED}Failed to install backend dependencies${NC}"
    exit 1
fi

cd ..

# Create .env files
echo -e "\n${YELLOW}Creating environment files...${NC}"

cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:8000
EOF

cat > backend/.env << EOF
LOG_LEVEL=INFO
MODEL_PATH=./models/
CACHE_SIZE=1000
PYTHONUNBUFFERED=1
EOF

echo -e "${GREEN}Environment files created${NC}"

echo -e "\n${GREEN}Setup complete!${NC}"
echo -e "${YELLOW}To start the application:${NC}"
echo -e "  Frontend: ${GREEN}npm run dev${NC}"
echo -e "  Backend:  ${GREEN}cd backend && source venv/bin/activate && python main.py${NC}"
