#!/bin/bash

# Load environment variables
if [ -f vars.sh ]; then
    source vars.sh
else
    echo "Warning: vars.sh not found. Using default environment variables."
fi

# Start the React development server
echo "Starting React development server..."
cd frontend && npm start
