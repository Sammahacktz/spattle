#!/bin/bash

# Load environment variables
if [ -f vars.sh ]; then
    source vars.sh
else
    echo "Warning: vars.sh not found. Using default environment variables."
fi

# Start the FastAPI development server
echo "Starting FastAPI development server..."
poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
