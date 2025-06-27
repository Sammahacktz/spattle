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
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Set up the database**
   ```bash
   # Create MySQL database
   mysql -u root -p -e "CREATE DATABASE spattle_db;"
   
   # Run migrations
   poetry run alembic upgrade head
   ```

### Running the Application

#### Backend (FastAPI)
```bash
# Development server with auto-reload
poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# The API will be available at http://localhost:8000
# API documentation at http://localhost:8000/docs
```

#### Frontend (React)
```bash
cd frontend
npm start

# The frontend will be available at http://localhost:3000
```

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

Copy `.env.example` to `.env` and configure:

```env
# Database
DATABASE_URL=mysql+pymysql://username:password@localhost:3306/spattle_db

# Security
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Frontend
REACT_APP_API_URL=http://localhost:8000
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
