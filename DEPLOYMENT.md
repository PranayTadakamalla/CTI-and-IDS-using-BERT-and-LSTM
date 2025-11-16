# CTI-IDS Deployment Guide

## Local Development

### Prerequisites
- Node.js 18+
- Python 3.9+
- pip and npm

### Quick Start

\`\`\`bash
# Run setup script
bash scripts/setup.sh

# Start development servers
bash scripts/run-dev.sh
\`\`\`

## Docker Deployment

### Build Images

\`\`\`bash
# Build all services
docker-compose build

# Start services
docker-compose up -d
\`\`\`

### Access Services
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Production Deployment

### Vercel (Frontend)

1. Push repository to GitHub
2. Import project in Vercel
3. Set environment variable: `NEXT_PUBLIC_API_URL=<your-backend-url>`
4. Deploy

### AWS EC2 (Backend)

\`\`\`bash
# Launch EC2 instance (Python 3.11, 4GB+ RAM)
ssh -i key.pem ubuntu@instance-ip

# Install dependencies
sudo apt-get update
sudo apt-get install python3.11 python3.11-venv git

# Clone repository
git clone <your-repo>
cd cti-ids

# Create virtual environment
python3.11 -m venv venv
source venv/bin/activate

# Install requirements
pip install -r backend/requirements.txt

# Run with gunicorn (production)
pip install gunicorn
cd backend
gunicorn main:app -w 4 -b 0.0.0.0:8000
\`\`\`

### Nginx Reverse Proxy

\`\`\`nginx
upstream backend {
    server localhost:8000;
}

server {
    listen 80;
    server_name api.example.com;

    location / {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
\`\`\`

## Monitoring

### System Health

\`\`\`bash
# Check backend health
curl http://localhost:8000/health

# Check API metrics
curl http://localhost:8000/api/metrics

# View logs
docker-compose logs backend
\`\`\`

### Performance Tuning

- Increase LSTM hidden units for better accuracy
- Implement model caching for faster inference
- Use GPU for production deployments
- Implement async processing for batch jobs

## Security

- Enable HTTPS/SSL in production
- Implement API authentication (JWT/OAuth2)
- Use environment variables for sensitive data
- Implement rate limiting
- Enable CORS only for trusted domains
- Regular security audits and updates
