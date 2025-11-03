#!/bin/bash

echo "🛑 Stopping Native Development Environment..."

# Kill backend and frontend processes
if [ -f .backend.pid ]; then
    BACKEND_PID=$(cat .backend.pid)
    kill $BACKEND_PID 2>/dev/null && echo "🔧 Backend stopped"
    rm -f .backend.pid
fi

if [ -f .frontend.pid ]; then
    FRONTEND_PID=$(cat .frontend.pid)
    kill $FRONTEND_PID 2>/dev/null && echo "🌐 Frontend stopped"
    rm -f .frontend.pid
fi

# Also kill any node processes on our ports (backup cleanup)
lsof -ti:5001 | xargs kill -9 2>/dev/null
lsof -ti:5173 | xargs kill -9 2>/dev/null

echo "✅ All services stopped!"
echo "💡 PostgreSQL is still running in background"
echo "💡 To start again, run: ./dev-start-native.sh"