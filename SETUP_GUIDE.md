# Complete Setup Guide: CTI-IDS Threat Intelligence Framework

This guide walks you through downloading, installing, and running the entire CTI-IDS system locally on your machine.

## Table of Contents
1. [System Requirements](#system-requirements)
2. [Download the Project](#download-the-project)
3. [Frontend Setup](#frontend-setup)
4. [Backend Setup](#backend-setup)
5. [Environment Configuration](#environment-configuration)
6. [Running the System](#running-the-system)
7. [Verification](#verification)
8. [Troubleshooting](#troubleshooting)

---

## System Requirements

### Minimum Requirements
- **Operating System**: Windows 10+, macOS 10.14+, or Linux (Ubuntu 18.04+)
- **RAM**: 8GB minimum (16GB recommended)
- **Storage**: 5GB free disk space
- **Internet**: Required for downloading dependencies and threat data

### Required Software
- **Node.js**: Version 18.0 or higher → [Download](https://nodejs.org/)
- **Python**: Version 3.9 or higher → [Download](https://www.python.org/)
- **Git**: For cloning the repository → [Download](https://git-scm.com/)
- **pip**: Python package manager (usually comes with Python)

### Optional but Recommended
- **GPU**: For faster model inference (CUDA-capable GPU)
- **Docker**: For containerized deployment
- **Virtual Environment Manager**: venv or conda for Python

---

## Download the Project

### Option 1: Using Git (Recommended)

\`\`\`bash
# Clone the repository
git clone <YOUR_REPOSITORY_URL>
cd cyber-threat-intelligence-framework

# Navigate to project root
pwd
\`\`\`

### Option 2: Download as ZIP

1. Click the "Download ZIP" button in the v0 top right menu
2. Extract the ZIP file to your desired location
3. Navigate to the extracted folder

\`\`\`bash
cd cyber-threat-intelligence-framework
\`\`\`

---

## Frontend Setup

### Step 1: Install Node.js Dependencies

\`\`\`bash
# Navigate to project root (if not already there)
cd <project-directory>

# Install all npm packages
npm install
\`\`\`

**Expected Output:**
\`\`\`
added 250+ packages in 2m 30s
\`\`\`

**What gets installed:**
- Next.js (React framework)
- React (UI library)
- Recharts (charting library)
- Lucide React (icons)
- Tailwind CSS (styling)

### Step 2: Verify Installation

\`\`\`bash
# Check Node.js version
node --version
# Should show: v18.0.0 or higher

# Check npm version
npm --version
# Should show: 9.0.0 or higher
\`\`\`

---

## Backend Setup

### Step 1: Create Python Virtual Environment

**Windows:**
\`\`\`bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
venv\Scripts\activate
\`\`\`

**macOS/Linux:**
\`\`\`bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate
\`\`\`

**Expected Output:** Your terminal should show `(venv)` prefix

### Step 2: Install Python Dependencies

\`\`\`bash
# Upgrade pip
pip install --upgrade pip

# Install required packages
pip install -r backend/requirements.txt
\`\`\`

**What gets installed:**
- FastAPI (API framework)
- Uvicorn (ASGI server)
- Transformers & Torch (BERT, LSTM)
- TensorFlow (Neural networks)
- Requests (HTTP client)
- Pandas & NumPy (Data processing)
- Scikit-learn (ML utilities)
- Python-logging (System logging)

**Installation Time:** 5-10 minutes (depending on internet speed)

### Step 3: Verify Installation

\`\`\`bash
# Check Python version
python --version
# Should show: Python 3.9+ 

# List installed packages
pip list
\`\`\`

---

## Environment Configuration

### Frontend Environment Setup

**Step 1: Create `.env.local` file in project root**

\`\`\`bash
# Create the file
touch .env.local  # macOS/Linux
# OR create manually on Windows
\`\`\`

**Step 2: Add environment variables to `.env.local`**

\`\`\`env
# Frontend API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# Optional: Analytics and Monitoring
NEXT_PUBLIC_APP_NAME=CTI-IDS
NEXT_PUBLIC_LOG_LEVEL=INFO
\`\`\`

**File Location:** `<project-root>/.env.local`

### Backend Environment Setup

**Step 1: Create `.env` file in `backend/` directory**

\`\`\`bash
# Create the file
cd backend
touch .env  # macOS/Linux
# OR create manually on Windows
cd ..
\`\`\`

**Step 2: Add environment variables to `backend/.env`**

\`\`\`env
# Backend Configuration
LOG_LEVEL=INFO
DEBUG=False
HOST=0.0.0.0
PORT=8000

# Model Configuration
MODEL_PATH=./models/
CACHE_SIZE=1000
MAX_WORKERS=4

# Security
API_KEY_REQUIRED=False
CORS_ORIGINS=http://localhost:3000

# Logging
LOG_FILE=backend/logs/system.log
\`\`\`

**File Location:** `<project-root>/backend/.env`

### Create Logging Directory

\`\`\`bash
# Create logs folder for backend
mkdir -p backend/logs

# Verify creation
ls backend/logs  # macOS/Linux
dir backend\logs  # Windows
\`\`\`

---

## Running the System

### Terminal Setup
You need **two separate terminal windows**:
- **Terminal 1**: For frontend (Next.js)
- **Terminal 2**: For backend (Python)

### Terminal 1: Start Frontend

\`\`\`bash
# Ensure you're in project root
cd <project-directory>

# Check that you're NOT in a virtual environment (no venv activated)
# If you see (venv) in your terminal, run: deactivate

# Start frontend development server
npm run dev
\`\`\`

**Expected Output:**
\`\`\`
> next dev

  ▲ Next.js 15.0.0
  
  Local:        http://localhost:3000
  Environments: .env.local

✓ Ready in 3.2s
\`\`\`

### Terminal 2: Start Backend

\`\`\`bash
# Open a NEW terminal window

# Navigate to project directory
cd <project-directory>

# Activate Python virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Navigate to backend
cd backend

# Start the API server
python main.py
\`\`\`

**Expected Output:**
\`\`\`
[2024-01-15 10:30:00] [main] INFO: Starting FastAPI server...
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started server process [12345]
\`\`\`

---

## Verification

### Check Frontend

1. Open browser and go to: **http://localhost:3000**
2. You should see:
   - CTI-IDS banner header
   - "Threat Analysis" form
   - Dashboard area with metrics
   - Logs & Monitoring tab

### Check Backend API

\`\`\`bash
# In a new terminal, test the API health endpoint
curl http://localhost:8000/health

# Expected response:
# {"status":"healthy","timestamp":"2024-01-15T10:30:00Z"}
\`\`\`

Or open in browser: **http://localhost:8000/docs**
- You'll see Swagger UI with all available API endpoints

### Test Full Connection

1. Go to **http://localhost:3000**
2. Fill in the threat analysis form:
   - Email Header: `From: unknown@malicious.com`
   - Threat Description: `Phishing attempt detected`
   - Indicators: `hash123`
3. Click "Analyze"
4. You should see:
   - Threat score results
   - Model predictions (BERT, LSTM, CNN)
   - API logs showing request/response

---

## File Structure After Setup

\`\`\`
cyber-threat-intelligence-framework/
├── .env.local                 # Frontend env vars
├── .gitignore
├── package.json              # Frontend dependencies
├── tsconfig.json            # TypeScript config
├── next.config.mjs          # Next.js config
│
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── api/
│       ├── analyze/route.ts
│       └── metrics/route.ts
│
├── components/
│   ├── header.tsx
│   ├── threat-analyzer-form.tsx
│   ├── threat-dashboard.tsx
│   ├── model-metrics.tsx
│   ├── api-logs-viewer.tsx
│   └── ui/
│
├── lib/
│   ├── api-client.ts        # API communication
│   ├── logger.ts            # Logging system
│   └── utils.ts
│
├── public/
│
├── backend/                  # Python backend
│   ├── .env                 # Backend env vars
│   ├── main.py              # FastAPI server
│   ├── requirements.txt      # Python dependencies
│   ├── config.py            # Configuration
│   │
│   ├── models/
│   │   ├── __init__.py
│   │   ├── hybrid_model.py  # BERT, LSTM, CNN
│   │   ├── bert_model.py
│   │   ├── lstm_model.py
│   │   └── cnn_model.py
│   │
│   ├── pipelines/
│   │   ├── __init__.py
│   │   ├── cti_pipeline.py  # Threat Intelligence
│   │   └── ids_pipeline.py  # Intrusion Detection
│   │
│   ├── utils/
│   │   ├── __init__.py
│   │   └── logger.py        # Logging
│   │
│   └── logs/
│       └── system.log       # Generated at runtime
│
└── SETUP_GUIDE.md           # This file
\`\`\`

---

## Running in Development Mode

### Quick Start Command

**For Windows (PowerShell as Administrator):**
\`\`\`bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend (in separate window)
cd backend
python main.py
\`\`\`

**For macOS/Linux:**
\`\`\`bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend (in separate window)
source venv/bin/activate
cd backend
python main.py
\`\`\`

---

## Troubleshooting

### Problem: `npm: command not found`
**Solution**: Node.js is not installed
\`\`\`bash
# Download and install Node.js from https://nodejs.org/
# Restart your terminal after installation
node --version
\`\`\`

### Problem: `python: command not found`
**Solution**: Python is not installed or not in PATH
\`\`\`bash
# Download and install Python from https://www.python.org/
# Check installation
python --version
# If that doesn't work, try:
python3 --version
\`\`\`

### Problem: Port 3000 or 8000 already in use
**Solution**: Kill the process using the port

**Windows:**
\`\`\`bash
# Find process on port 3000
netstat -ano | findstr :3000
# Kill it (replace PID with actual process ID)
taskkill /PID <PID> /F
\`\`\`

**macOS/Linux:**
\`\`\`bash
# Find and kill process on port 3000
lsof -ti:3000 | xargs kill -9
# For port 8000
lsof -ti:8000 | xargs kill -9
\`\`\`

### Problem: `ModuleNotFoundError` when running backend
**Solution**: Virtual environment not activated or dependencies not installed
\`\`\`bash
# Ensure venv is activated (should see (venv) prefix)
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Reinstall dependencies
pip install -r backend/requirements.txt
\`\`\`

### Problem: Frontend can't connect to backend
**Solution**: Check `.env.local` and ensure backend is running
\`\`\`bash
# 1. Verify NEXT_PUBLIC_API_URL in .env.local
cat .env.local

# 2. Test backend is running
curl http://localhost:8000/health

# 3. If backend not running, start it in Terminal 2
cd backend
python main.py
\`\`\`

### Problem: Slow performance or model inference taking long
**Solution**: Normal on CPU, can be improved with GPU
- Install CUDA for GPU acceleration
- Or reduce model complexity
- See logs for detailed timing: `tail -f backend/logs/system.log`

### Problem: Port 8000 access denied (Linux/macOS)
**Solution**: Port 8000 requires sudo
\`\`\`bash
# Use a different port
cd backend
python main.py --port 9000
# Then update .env.local NEXT_PUBLIC_API_URL=http://localhost:9000
\`\`\`

---

## Next Steps

1. **Explore the Dashboard**: Test threat analysis with various inputs
2. **Review Logs**: Check `Logs & Monitoring` tab for API calls
3. **Integrate Real Data**: Update pipelines with real threat sources
4. **Deploy**: Use Docker or deploy frontend to Vercel, backend to AWS/Azure
5. **Customize**: Add authentication, alerts, and additional models

---

## Getting Help

- Check the logs: `backend/logs/system.log`
- Browser console: Press `F12` → Console tab
- Check API docs: `http://localhost:8000/docs`

Good luck! 🚀
