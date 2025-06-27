#!/bin/bash
# reset-db.sh: Drop and recreate all tables, then run Alembic migrations from scratch.
# WARNING: This will erase ALL data in your database!

set -e

# Load environment variables (DB connection info)
if [ -f vars.sh ]; then
  source vars.sh
fi

# You may need to adjust these variables if not set in vars.sh
DB_USER=${MYSQL_USER:-spattle_user}
DB_PASS=${MYSQL_PASSWORD:-password}
DB_NAME=${MYSQL_DATABASE:-spattle}
DB_HOST=${DB_HOST:-localhost}

# Delete all Alembic migration version files (except __init__.py)
ALEMBIC_VERSIONS_DIR="alembic/versions"
echo "Deleting Alembic migration files in $ALEMBIC_VERSIONS_DIR..."
find "$ALEMBIC_VERSIONS_DIR" -type f ! -name "__init__.py" -delete

# Drop and recreate the database (MySQL/MariaDB)
echo "Dropping and recreating database $DB_NAME..."
mysql -u"$DB_USER" -p"$DB_PASS" -h "$DB_HOST" -e "DROP DATABASE IF EXISTS $DB_NAME; CREATE DATABASE $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Run Alembic migrations
poetry run alembic revision --autogenerate -m "Initial tables"
poetry run alembic upgrade head

echo "Database reset and migrated!"
