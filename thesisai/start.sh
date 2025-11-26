#!/bin/bash

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                                                           ║"
echo "║   ████████╗██╗  ██╗███████╗███████╗██╗███████╗          ║"
echo "║   ╚══██╔══╝██║  ██║██╔════╝██╔════╝██║██╔════╝          ║"
echo "║      ██║   ███████║█████╗  ███████╗██║███████╗          ║"
echo "║      ██║   ██╔══██║██╔══╝  ╚════██║██║╚════██║          ║"
echo "║      ██║   ██║  ██║███████╗███████║██║███████║          ║"
echo "║      ╚═╝   ╚═╝  ╚═╝╚══════╝╚══════╝╚═╝╚══════╝          ║"
echo "║                                                           ║"
echo "║              AI-Powered Thesis Assessment                ║"
echo "║                    Version 1.0.0                          ║"
echo "║                                                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    cp .env.example .env
    echo "✅ Created .env file. Please edit it with your configuration."
    echo ""
    echo "⚠️  IMPORTANT: Add your Claude API key to .env before proceeding!"
    echo ""
    read -p "Press Enter when you've configured .env..."
fi

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "🚀 Starting ThesisAI..."
echo ""

# Stop existing containers
echo "📦 Stopping existing containers..."
docker-compose down

# Build and start services
echo "🔨 Building and starting services..."
docker-compose up --build -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check service status
echo ""
echo "📊 Service Status:"
docker-compose ps

echo ""
echo "✅ ThesisAI is now running!"
echo ""
echo "🌐 Access the application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:8080"
echo "   MySQL: localhost:3306"
echo ""
echo "👤 Default Login:"
echo "   Email: admin@aucdt.edu.gh"
echo "   Password: Admin@123"
echo ""
echo "📝 View logs: docker-compose logs -f"
echo "🛑 Stop services: docker-compose down"
echo ""
