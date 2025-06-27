#!/bin/bash

# Start the FastAPI development server
echo "Starting FastAPI development server..."
poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
