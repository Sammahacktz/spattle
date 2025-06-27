# Development Guide

This guide will help you set up and run the Spattle application for development.

## Prerequisites

### Required Software
- **Python 3.9+** - Backend runtime
- **Node.js 16+** - Frontend runtime  
- **MySQL 8.0+** - Database
- **Poetry** - Python dependency management
- **Git** - Version control

### Installation Commands

#### Ubuntu/Debian
```bash
# Python and pip
sudo apt update
sudo apt install python3.9 python3-pip

# Node.js
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# MySQL
sudo apt install mysql-server

# Poetry
curl -sSL https://install.python-poetry.org | python3 -
```

#### macOS
```bash
# Using Homebrew
brew install python@3.9 node mysql poetry
```

#### Windows
- Install Python from [python.org](https://python.org)
- Install Node.js from [nodejs.org](https://nodejs.org)
- Install MySQL from [mysql.com](https://dev.mysql.com/downloads/installer/)
- Install Poetry from [python-poetry.org](https://python-poetry.org/docs/#installation)

## Quick Setup

### 1. Clone and Setup
```bash
git clone <repository-url>
cd spattle
./setup.sh
```

### 2. Environment Configuration
```bash
cp .env.example .env
# Edit .env with your settings
```

### 3. Database Setup
```bash
# Option A: Use setup script
./setup-db.sh

# Option B: Manual setup
mysql -u root -p -e "CREATE DATABASE spattle_db;"
poetry run alembic upgrade head
```

### 4. Start Development Servers

#### Terminal Method
```bash
# Terminal 1 - Backend
./start-backend.sh

# Terminal 2 - Frontend
./start-frontend.sh
```

#### VS Code Method
1. Open VS Code in the project directory
2. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
3. Type "Tasks: Run Task"
4. Select "Start Full Stack (Backend + Frontend)"

## Development Workflow

### Backend Development

#### Project Structure
```
app/
├── main.py              # FastAPI app entry point
├── api/v1/              # API routes
├── core/config.py       # Configuration
├── db/database.py       # Database connection
├── models/              # SQLAlchemy models
├── schemas/             # Pydantic schemas
└── services/            # Business logic
```

#### Common Commands
```bash
# Install dependencies
poetry install

# Start development server
poetry run uvicorn app.main:app --reload

# Run tests
poetry run pytest

# Format code
poetry run black app/
poetry run isort app/

# Type checking
poetry run mypy app/

# Create migration
poetry run alembic revision --autogenerate -m "Add new model"

# Apply migrations
poetry run alembic upgrade head
```

### Frontend Development

#### Project Structure
```
frontend/src/
├── components/          # Reusable components
├── pages/              # Page components
├── contexts/           # React contexts
├── services/           # API services
├── types/              # TypeScript types
└── App.tsx             # Main app component
```

#### Common Commands
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Type checking
npx tsc --noEmit
```

## Database Management

### Migrations
```bash
# Create new migration
poetry run alembic revision --autogenerate -m "Description"

# Apply migrations
poetry run alembic upgrade head

# Rollback one migration
poetry run alembic downgrade -1

# View migration history
poetry run alembic history
```

### Reset Database
```bash
# Drop all tables and recreate
poetry run alembic downgrade base
poetry run alembic upgrade head
```

## API Documentation

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/api/v1/openapi.json

## Testing

### Backend Tests
```bash
# Run all tests
poetry run pytest

# Run with coverage
poetry run pytest --cov=app

# Run specific test file
poetry run pytest tests/test_main.py

# Run with verbose output
poetry run pytest -v
```

### Frontend Tests
```bash
cd frontend

# Run tests once
npm test -- --watchAll=false

# Run tests in watch mode
npm test

# Run with coverage
npm test -- --coverage --watchAll=false
```

## Docker Development

### Start Database Only
```bash
docker-compose -f docker-compose.dev.yml up -d
```

### Full Docker Setup
```bash
# Build and start all services
docker-compose up --build

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Troubleshooting

### Common Issues

#### Backend Issues
1. **ImportError: No module named 'app'**
   ```bash
   # Make sure you're in the project root
   export PYTHONPATH="${PYTHONPATH}:$(pwd)"
   ```

2. **Database connection error**
   - Check MySQL is running
   - Verify credentials in .env
   - Test connection: `mysql -u username -p`

3. **Alembic migration errors**
   ```bash
   # Reset migrations
   rm -rf alembic/versions/*
   poetry run alembic revision --autogenerate -m "Initial"
   poetry run alembic upgrade head
   ```

#### Frontend Issues
1. **Module not found errors**
   ```bash
   cd frontend
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **CORS errors**
   - Check backend CORS configuration in `app/core/config.py`
   - Verify frontend URL is in `BACKEND_CORS_ORIGINS`

3. **API connection issues**
   - Verify `REACT_APP_API_URL` in frontend/.env
   - Check backend is running on correct port

### Debug Mode

#### Backend Debug
1. Set breakpoints in VS Code
2. Use "Python: FastAPI" debug configuration
3. Start debugging (F5)

#### Frontend Debug
1. Use browser developer tools
2. Add `debugger;` statements in code
3. Use React Developer Tools extension

## Code Style

### Backend (Python)
- Use Black for formatting
- Use isort for import sorting
- Use flake8 for linting
- Use mypy for type checking
- Follow PEP 8 guidelines

### Frontend (TypeScript/React)
- Use Prettier for formatting
- Use ESLint for linting
- Use TypeScript strict mode
- Follow React best practices

## Performance Tips

### Backend
- Use async/await for database operations
- Implement proper database indexing
- Use database connection pooling
- Cache frequently accessed data

### Frontend
- Use React.memo for expensive components
- Implement proper error boundaries
- Optimize bundle size with code splitting
- Use React DevTools Profiler

## Deployment

### Environment Variables
Make sure to set production values for:
- `SECRET_KEY` - Strong random key
- `DATABASE_URL` - Production database
- `BACKEND_CORS_ORIGINS` - Production domains

### Build Commands
```bash
# Backend
docker build -f Dockerfile.backend -t spattle-backend .

# Frontend
docker build -f Dockerfile.frontend -t spattle-frontend .
```

## Getting Help

1. Check this documentation
2. Look at error logs in terminal
3. Check browser console for frontend issues
4. Review FastAPI auto-generated docs
5. Search existing issues in repository
