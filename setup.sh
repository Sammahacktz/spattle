#!/bin/bash

# Install Python dependencies
echo "Installing Python dependencies..."
poetry install

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd frontend && npm install && cd ..

echo "Setup complete!"
echo ""
echo "Next steps:"
echo "1. Copy .env.example to .env and configure your database settings"
echo "2. Set up your MySQL database"
echo "3. Run database migrations: poetry run alembic upgrade head"
echo "4. Start the backend: poetry run uvicorn app.main:app --reload"
echo "5. Start the frontend: cd frontend && npm start"
