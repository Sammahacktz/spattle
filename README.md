# Spattle - Sport Battle Platform

A full-stack web application for organizing and participating in sport battles. Built with FastAPI, React, TypeScript, and Material-UI.

## Technology Stack

### Backend
- **FastAPI** - Modern, fast web framework for building APIs
- **Poetry** - Dependency management and packaging
- **MySQL** - Database
- **Pydantic** - Data validation using Python type annotations
- **SQLAlchemy** - SQL toolkit and ORM
- **Alembic** - Database migration tool
- **JWT** - Authentication

### Frontend
- **React** - UI library
- **TypeScript** - Type-safe JavaScript
- **Material-UI (MUI)** - React component library (free version)
- **Axios** - HTTP client
- **React Router** - Navigation

## Project Structure

```
spattle/
├── app/                    # FastAPI backend
│   ├── main.py            # Application entry point
│   ├── api/               # API routes
│   ├── core/              # Core configurations
│   ├── db/                # Database setup
│   ├── models/            # SQLAlchemy models
│   ├── schemas/           # Pydantic schemas
│   └── services/          # Business logic
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   ├── services/      # API services
│   │   └── types/         # TypeScript types
├── alembic/               # Database migrations
└── pyproject.toml         # Python dependencies
```

## Quick Start

### Prerequisites
- Python 3.9+
- Node.js 16+
- MySQL 8.0+
- Poetry

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd spattle
   ```

2. **Run the setup script**
   ```bash
   ./setup.sh
   ```

3. **Set up environment variables**
   ```bash
   cp vars.sh.example vars.sh
   # Edit vars.sh with your actual database credentials and secrets
   # IMPORTANT: vars.sh is ignored by git for security
   ```

4. **Set up the database**
   ```bash
   # Load environment variables and set up database
   source vars.sh
   ./setup-db.sh
   
   # Run migrations
   poetry run alembic upgrade head
   ```

### Running the Application

#### Using Helper Scripts (Recommended)
```bash
# Start backend (automatically loads vars.sh)
./start-backend.sh

# Start frontend (automatically loads vars.sh)
./start-frontend.sh
```

#### Manual Commands
```bash
# Backend (FastAPI)
source vars.sh  # Load environment variables
poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Frontend (React)
cd frontend
npm start
```

The API will be available at http://localhost:8000
The frontend will be available at http://localhost:3000

## API Documentation

The FastAPI backend automatically generates interactive API documentation:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Features

### Current Features
- User registration and authentication
- JWT-based authorization
- Battle creation and management
- Responsive Material-UI design
- Type-safe API communication

### Planned Features
- Battle participation and scoring
- User profiles and statistics
- Real-time notifications
- File uploads for battle media
- Advanced search and filtering

## Development

### Backend Development
```bash
# Install dependencies
poetry install

# Run tests
poetry run pytest

# Format code
poetry run black app/
poetry run isort app/

# Type checking
poetry run mypy app/
```

### Frontend Development
```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

### Database Migrations
```bash
# Create a new migration
poetry run alembic revision --autogenerate -m "Description of changes"

# Apply migrations
poetry run alembic upgrade head

# Rollback migration
poetry run alembic downgrade -1
```

## Configuration

### Environment Variables

Copy `vars.sh.example` to `vars.sh` and configure your secrets:

```bash
# Database Configuration
export MYSQL_ROOT_PASSWORD="your_secure_root_password_here"
export MYSQL_DATABASE="spattle_db"
export MYSQL_USER="spattle_user"
export MYSQL_PASSWORD="your_secure_password_here"
export DATABASE_URL="mysql+pymysql://${MYSQL_USER}:${MYSQL_PASSWORD}@localhost:3306/${MYSQL_DATABASE}"

# Security - CHANGE THESE IN PRODUCTION!
export SECRET_KEY="your-super-secret-jwt-key-change-this-in-production"
export ALGORITHM="HS256"
export ACCESS_TOKEN_EXPIRE_MINUTES="30"

# Frontend Configuration
export REACT_APP_API_URL="http://localhost:8000"
```

**Important Security Notes:**
- `vars.sh` is automatically ignored by git to prevent accidentally committing secrets
- Always use strong, unique passwords in production
- Change the default SECRET_KEY before deploying
- Consider using a secrets management service for production deployments

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
