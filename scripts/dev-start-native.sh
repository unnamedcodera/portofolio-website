#!/bin/bash

# Add Node.js@20 to PATH
export PATH="/opt/homebrew/opt/node@20/bin:$PATH"

echo "🚀 Starting Native Development Environment..."
echo "📦 Services: PostgreSQL + Backend + Frontend"
echo ""

# Check if PostgreSQL is running
if ! brew services list | grep -q "postgresql@15.*started"; then
    echo "🗄️  Starting PostgreSQL..."
    brew services start postgresql@15
    sleep 2
fi

echo "✅ PostgreSQL is running"

# Start backend in background
echo "🔧 Starting Backend API..."
cd backend
npm run dev &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"
cd ..

# Wait a moment for backend to start
sleep 3

# Start frontend in background  
echo "🌐 Starting Frontend..."
cd frontend
npm run dev &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"
cd ..

echo ""
echo "✅ Native development environment started!"
echo ""
echo "🔗 Available Services:"
echo "   🗄️  PostgreSQL Database: localhost:5432"
echo "   🔧 Backend API: http://localhost:5001"
echo "   🌐 Frontend: http://localhost:5173"
echo ""
echo "📋 Useful commands:"
echo "   View logs: ./dev-logs-native.sh"
echo "   Stop services: ./dev-stop-native.sh"
echo "   Connect to DB: ./dev-db-native.sh"
echo ""
echo "🗄️  Database connection:"
echo "   psql -h localhost -U darahitam -d darahitam_dev"
echo ""

# Store PIDs for later cleanup
echo $BACKEND_PID > .backend.pid
echo $FRONTEND_PID > .frontend.pid

echo "💡 Press Ctrl+C to stop all services"

# Wait for user interrupt
trap 'echo ""; echo "🛑 Stopping all services..."; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; rm -f .backend.pid .frontend.pid; echo "✅ All services stopped!"; exit 0' INT

# Keep script running
wait