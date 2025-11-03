#!/bin/bash

echo "📊 Viewing development logs..."
echo "💡 Use Ctrl+C to stop viewing logs"
echo ""

# Function to show logs for a process
show_logs() {
    local process_name=$1
    local log_file=$2
    
    if [ -f "$log_file" ]; then
        echo "📋 $process_name logs:"
        echo "----------------------------------------"
        tail -f "$log_file" &
        local tail_pid=$!
        
        # Store the tail PID for cleanup
        echo $tail_pid >> .dev-logs-pids
        
        return 0
    else
        echo "❌ $process_name log file not found: $log_file"
        return 1
    fi
}

# Create PID file for log viewers
touch .dev-logs-pids

# Cleanup function
cleanup() {
    echo ""
    echo "🧹 Stopping log viewing..."
    
    if [ -f .dev-logs-pids ]; then
        while read -r pid; do
            if [ -n "$pid" ] && kill -0 "$pid" 2>/dev/null; then
                kill "$pid" 2>/dev/null
            fi
        done < .dev-logs-pids
        rm -f .dev-logs-pids
    fi
    
    echo "✅ Log viewing stopped"
    exit 0
}

# Set up signal handling
trap cleanup SIGINT SIGTERM

# Check if development servers are running
backend_running=false
frontend_running=false

if [ -f .dev-backend-pid ] && [ -s .dev-backend-pid ]; then
    backend_pid=$(cat .dev-backend-pid)
    if kill -0 "$backend_pid" 2>/dev/null; then
        backend_running=true
    fi
fi

if [ -f .dev-frontend-pid ] && [ -s .dev-frontend-pid ]; then
    frontend_pid=$(cat .dev-frontend-pid)
    if kill -0 "$frontend_pid" 2>/dev/null; then
        frontend_running=true
    fi
fi

# Show logs based on what's running
if [ "$backend_running" = true ] && [ "$frontend_running" = true ]; then
    echo "📱 Backend and Frontend are running"
    show_logs "Backend" ".dev-backend.log" &
    show_logs "Frontend" ".dev-frontend.log" &
    wait
elif [ "$backend_running" = true ]; then
    echo "🖥️  Backend is running"
    show_logs "Backend" ".dev-backend.log"
elif [ "$frontend_running" = true ]; then
    echo "📱 Frontend is running"
    show_logs "Frontend" ".dev-frontend.log"
else
    echo "❌ No development servers are currently running"
    echo "💡 Start development with: ./dev-start-native.sh"
    exit 1
fi