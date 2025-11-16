#!/bin/bash

# CTI-IDS Framework - Complete Installation Script

echo "================================"
echo "CTI-IDS Framework Setup"
echo "================================"
echo ""

# Check Node.js
echo "Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi
echo "✓ Node.js $(node -v)"

# Check Python
echo "Checking Python..."
if ! command -v python3 &> /dev/null; then
    echo "❌ Python not found. Please install Python 3.9+"
    exit 1
fi
PYTHON_VERSION=$(python3 --version | cut -d' ' -f2)
echo "✓ Python $PYTHON_VERSION"

# Install Node dependencies
echo ""
echo "Installing frontend dependencies..."
npm install
if [ $? -eq 0 ]; then
    echo "✓ Frontend dependencies installed"
else
    echo "❌ Frontend installation failed"
    exit 1
fi

# Create Python venv
echo ""
echo "Creating Python virtual environment..."
python3 -m venv venv
if [ $? -eq 0 ]; then
    echo "✓ Virtual environment created"
else
    echo "❌ Failed to create venv"
    exit 1
fi

# Activate venv
echo "Activating virtual environment..."
source venv/bin/activate

# Install Python dependencies
echo "Installing backend dependencies..."
pip install -r backend/requirements.txt
if [ $? -eq 0 ]; then
    echo "✓ Backend dependencies installed"
else
    echo "❌ Backend installation failed"
    exit 1
fi

# Setup environment files
echo ""
echo "Setting up environment files..."
cp .env.local.example .env.local 2>/dev/null || echo "ℹ .env.local already exists"
cp backend/.env.example backend/.env 2>/dev/null || echo "ℹ backend/.env already exists"

echo ""
echo "================================"
echo "✓ Setup Complete!"
echo "================================"
echo ""
echo "Next steps:"
echo "1. Edit .env.local with NEXT_PUBLIC_API_URL"
echo "2. Edit backend/.env with your API keys"
echo "3. Run: npm run dev (Terminal 1)"
echo "4. Run: cd backend && python main.py (Terminal 2)"
echo ""
