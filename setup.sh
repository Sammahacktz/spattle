#!/bin/bash

# Load environment variables if available
if [ -f vars.sh ]; then
    source vars.sh
    echo "Environment variables loaded from vars.sh"
fi

# Install Python dependencies
echo "Installing Python dependencies..."
poetry install

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd frontend && npm install && cd ..

echo "Setup complete!"
echo ""
echo "Next steps:"
echo "1. Create and configure vars.sh with your secrets (see vars.sh.example)"
echo "2. Set up your MySQL database: ./setup-db.sh"
echo "3. Run database migrations: poetry run alembic upgrade head"
echo "4. Start the backend: ./start-backend.sh"
echo "5. Start the frontend: ./start-frontend.sh"
