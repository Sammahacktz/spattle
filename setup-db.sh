#!/bin/bash

# Database setup script
echo "Setting up database..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
    echo "Please edit .env file with your database credentials before proceeding."
    exit 1
fi

# Source environment variables
source .env

# Extract database credentials from DATABASE_URL
DB_USER=$(echo $DATABASE_URL | sed -n 's|.*://\([^:]*\):.*|\1|p')
DB_PASS=$(echo $DATABASE_URL | sed -n 's|.*://[^:]*:\([^@]*\)@.*|\1|p')
DB_HOST=$(echo $DATABASE_URL | sed -n 's|.*@\([^:]*\):.*|\1|p')
DB_NAME=$(echo $DATABASE_URL | sed -n 's|.*/\([^?]*\).*|\1|p')

echo "Database configuration:"
echo "Host: $DB_HOST"
echo "User: $DB_USER"
echo "Database: $DB_NAME"

# Create database if it doesn't exist
echo "Creating database if it doesn't exist..."
mysql -h $DB_HOST -u root -p -e "CREATE DATABASE IF NOT EXISTS $DB_NAME;"
mysql -h $DB_HOST -u root -p -e "CREATE USER IF NOT EXISTS '$DB_USER'@'%' IDENTIFIED BY '$DB_PASS';"
mysql -h $DB_HOST -u root -p -e "GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'%';"
mysql -h $DB_HOST -u root -p -e "FLUSH PRIVILEGES;"

# Run migrations
echo "Running database migrations..."
poetry run alembic upgrade head

echo "Database setup complete!"
