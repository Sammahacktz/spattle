#!/bin/bash

# Load environment variables
if [ -f vars.sh ]; then
    source vars.sh
else
    echo "Warning: vars.sh not found. Using default environment variables."
fi

# Start the FastAPI development server
echo "Starting FastAPI development server..."
poetry run uvicorn app.main:app --uds /tmp/uvicorn.sock --ssl-certfile /etc/ssl/private/fullchain.pem --ssl-keyfile /etc/ssl/private/private.pem 
