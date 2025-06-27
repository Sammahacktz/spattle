#!/bin/bash

# Database setup script
echo "Setting up database..."

# Check if vars.sh file exists
if [ ! -f vars.sh ]; then
    echo "Error: vars.sh file not found!"
    echo "Please create vars.sh file with your database credentials."
    echo "You can copy from vars.sh.example if available."
    exit 1
fi

# Source environment variables
source vars.sh

echo "Database configuration:"
echo "Host: localhost"
echo "User: $MYSQL_USER"
echo "Database: $MYSQL_DATABASE"

# Create database if it doesn't exist
echo "Creating database if it doesn't exist..."
mysql -h localhost -u root -p -e "CREATE DATABASE IF NOT EXISTS $MYSQL_DATABASE;"
mysql -h localhost -u root -p -e "CREATE USER IF NOT EXISTS '$MYSQL_USER'@'%' IDENTIFIED BY '$MYSQL_PASSWORD';"
mysql -h localhost -u root -p -e "GRANT ALL PRIVILEGES ON $MYSQL_DATABASE.* TO '$MYSQL_USER'@'%';"
mysql -h localhost -u root -p -e "FLUSH PRIVILEGES;"

# Run migrations
echo "Running database migrations..."
poetry run alembic upgrade head

echo "Database setup complete!"
