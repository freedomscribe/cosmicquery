# CosmicQuery Backend Implementation Guide

## Overview

This document provides complete backend implementation code for the CosmicQuery application. The backend is built with FastAPI and integrates with NASA APIs and OpenAI for AI-powered responses.

---

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app initialization
│   ├── config.py            # Configuration management
│   ├── database.py          # Database connection
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py          # User model
│   │   ├── query.py         # Query history model
│   │   └── favorite.py      # Favorites model
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── user.py          # Pydantic schemas
│   │   ├── query.py
│   │   └── response.py
│   ├── api/
│   │   ├── __init__.py
│   │   ├── routes/
│   │   │   ├── query.py     # Query endpoints
│   │   │   ├── user.py      # User endpoints
│   │   │   └── nasa.py      # NASA API integration
│   │   └── deps.py          # Dependencies
│   ├── services/
│   │   ├── __init__.py
│   │   ├── ai_service.py    # AI query processing
│   │   ├── nasa_service.py  # NASA API wrapper
│   │   └── auth_service.py  # Authentication
│   └── utils/
│       ├── __init__.py
│       └── helpers.py
├── tests/
├── alembic/
├── requirements.txt
├── .env.example
└── README.md
```

---

## Installation & Setup

### 1. Create requirements.txt

```txt
fastapi==0.115.0
uvicorn[standard]==0.32.0
pydantic==2.9.0
pydantic-settings==2.5.0
sqlalchemy==2.0.35
alembic==1.13.3
psycopg2-binary==2.9.9
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.12
requests==2.32.3
openai==1.54.0
python-dotenv==1.0.1
redis==5.0.8
```

### 2. Install Dependencies

```bash
cd backend
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 3. Create .env File

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/cosmicquery

# API Keys
OPENAI_API_KEY=sk-your-openai-key
NASA_API_KEY=your-nasa-api-key

# Security
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Redis
REDIS_URL=redis://localhost:6379

# CORS
ALLOWED_ORIGINS=http://localhost:5173,https://cosmicquery.com
```

---

## Core Implementation Files

### app/config.py

```python
from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    # Database
    database_url: str
    
    # API Keys
    openai_api_key: str
    nasa_api_key: str
    
    # Security
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # Redis
    redis_url: str
    
    # CORS
    allowed_origins: str
    
    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()
```

### app/database.py

```python
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config import get_settings

settings = get_settings()

engine = create_engine(settings.database_url)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

### app/models/user.py

```python
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from app.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_premium = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
```

### app/models/query.py

```python
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

class Query(Base):
    __tablename__ = "queries"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=False)
    image_url = Column(String, nullable=True)
    nasa_data = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    user = relationship("User", backref="queries")
```

### app/services/nasa_service.py

```python
import requests
from typing import Optional, Dict, Any
from datetime import datetime, timedelta
from app.config import get_settings
import redis
import json

settings = get_settings()
redis_client = redis.from_url(settings.redis_url)

class NASAService:
    def __init__(self):
        self.api_key = settings.nasa_api_key
        self.base_url = "https://api.nasa.gov"
    
    def _get_cached(self, key: str) -> Optional[Dict[Any, Any]]:
        """Get cached data from Redis"""
        cached = redis_client.get(key)
        if cached:
            return json.loads(cached)
        return None
    
    def _set_cache(self, key: str, data: Dict[Any, Any], expire: int = 3600):
        """Set cache in Redis with expiration"""
        redis_client.setex(key, expire, json.dumps(data))
    
    async def get_apod(self, date: Optional[str] = None) -> Dict[Any, Any]:
        """Get Astronomy Picture of the Day"""
        cache_key = f"apod:{date or 'today'}"
        cached = self._get_cached(cache_key)
        if cached:
            return cached
        
        endpoint = f"{self.base_url}/planetary/apod"
        params = {"api_key": self.api_key}
        if date:
            params["date"] = date
        
        try:
            response = requests.get(endpoint, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            self._set_cache(cache_key, data, expire=86400)  # Cache for 24 hours
            return data
        except requests.RequestException as e:
            return {"error": str(e)}
    
    async def get_neo_feed(self, start_date: str, end_date: str) -> Dict[Any, Any]:
        """Get Near Earth Object feed"""
        cache_key = f"neo:{start_date}:{end_date}"
        cached = self._get_cached(cache_key)
        if cached:
            return cached
        
        endpoint = f"{self.base_url}/neo/rest/v1/feed"
        params = {
            "api_key": self.api_key,
            "start_date": start_date,
            "end_date": end_date
        }
        
        try:
            response = requests.get(endpoint, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            self._set_cache(cache_key, data, expire=3600)  # Cache for 1 hour
            return data
        except requests.RequestException as e:
            return {"error": str(e)}
    
    async def get_mars_photos(self, sol: int = 1000, camera: str = "FHAZ") -> Dict[Any, Any]:
        """Get Mars Rover photos"""
        cache_key = f"mars:{sol}:{camera}"
        cached = self._get_cached(cache_key)
        if cached:
            return cached
        
        endpoint = f"{self.base_url}/mars-photos/api/v1/rovers/curiosity/photos"
        params = {
            "api_key": self.api_key,
            "sol": sol,
            "camera": camera
        }
        
        try:
            response = requests.get(endpoint, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            self._set_cache(cache_key, data, expire=86400)
            return data
        except requests.RequestException as e:
            return {"error": str(e)}
```

### app/services/ai_service.py

```python
from openai import OpenAI
from typing import Optional, Dict, Any
from app.config import get_settings

settings = get_settings()

class AIService:
    def __init__(self):
        self.client = OpenAI(api_key=settings.openai_api_key)
    
    async def process_query(
        self, 
        question: str, 
        context: Optional[Dict[Any, Any]] = None,
        user_premium: bool = False
    ) -> str:
        """Process space-related query with AI"""
        
        system_prompt = """You are an expert astronomer and space science educator.
        Provide accurate, engaging answers about space, astronomy, and related topics.
        Use simple language but maintain scientific accuracy.
        When appropriate, mention interesting facts or recent discoveries.
        Keep responses concise but informative (2-3 paragraphs)."""
        
        messages = [
            {"role": "system", "content": system_prompt},
        ]
        
        # Add context if available (e.g., NASA data)
        if context:
            context_msg = f"Additional context from NASA: {context}"
            messages.append({"role": "system", "content": context_msg})
        
        messages.append({"role": "user", "content": question})
        
        # Use better model for premium users
        model = "gpt-4.1-mini" if user_premium else "gpt-4.1-nano"
        
        try:
            response = self.client.chat.completions.create(
                model=model,
                messages=messages,
                temperature=0.7,
                max_tokens=500
            )
            
            return response.choices[0].message.content
        except Exception as e:
            return f"I apologize, but I encountered an error processing your query: {str(e)}"
    
    async def generate_exoplanet_description(
        self,
        params: Dict[str, Any]
    ) -> str:
        """Generate description for custom exoplanet"""
        
        prompt = f"""Generate a brief, scientifically plausible description of an exoplanet with these characteristics:
        - Star type: {params.get('star_type')}
        - Orbit distance: {params.get('orbit_distance')} AU
        - Planet mass: {params.get('mass')} Earth masses
        - Atmosphere: {params.get('atmosphere_type')}
        - Surface temperature: {params.get('temperature')} K
        
        Make it engaging and educational."""
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-4.1-mini",
                messages=[
                    {"role": "system", "content": "You are an exoplanet scientist."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.8,
                max_tokens=300
            )
            
            return response.choices[0].message.content
        except Exception as e:
            return f"Error generating description: {str(e)}"
```

### app/api/routes/query.py

```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.query import QueryRequest, QueryResponse
from app.services.ai_service import AIService
from app.services.nasa_service import NASAService
from app.models.query import Query
from app.models.user import User
from typing import Optional

router = APIRouter(prefix="/api/query", tags=["queries"])

ai_service = AIService()
nasa_service = NASAService()

@router.post("/", response_model=QueryResponse)
async def create_query(
    request: QueryRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = None
):
    """Process a space query"""
    
    # Check if user is premium (for rate limiting)
    is_premium = current_user and current_user.is_premium
    
    # Try to get relevant NASA data
    nasa_data = None
    if "apod" in request.question.lower() or "picture" in request.question.lower():
        nasa_data = await nasa_service.get_apod()
    
    # Process query with AI
    answer = await ai_service.process_query(
        question=request.question,
        context=nasa_data,
        user_premium=is_premium
    )
    
    # Save query to database
    db_query = Query(
        user_id=current_user.id if current_user else None,
        question=request.question,
        answer=answer,
        image_url=nasa_data.get("url") if nasa_data and "url" in nasa_data else None,
        nasa_data=str(nasa_data) if nasa_data else None
    )
    db.add(db_query)
    db.commit()
    db.refresh(db_query)
    
    return QueryResponse(
        id=db_query.id,
        question=db_query.question,
        answer=db_query.answer,
        image_url=db_query.image_url,
        created_at=db_query.created_at
    )

@router.get("/history")
async def get_query_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    limit: int = 20
):
    """Get user's query history"""
    queries = db.query(Query).filter(
        Query.user_id == current_user.id
    ).order_by(Query.created_at.desc()).limit(limit).all()
    
    return queries
```

### app/main.py

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import get_settings
from app.api.routes import query, user, nasa
from app.database import engine, Base

settings = get_settings()

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="CosmicQuery API",
    description="AI-powered space exploration API",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(query.router)
app.include_router(user.router)
app.include_router(nasa.router)

@app.get("/")
async def root():
    return {
        "message": "Welcome to CosmicQuery API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

---

## Running the Backend

### Development

```bash
# Start the server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Access API docs
# http://localhost:8000/docs
```

### Production

```bash
# Using Gunicorn with Uvicorn workers
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

---

## Database Migrations

### Initialize Alembic

```bash
alembic init alembic
```

### Create Migration

```bash
alembic revision --autogenerate -m "Create initial tables"
```

### Run Migrations

```bash
alembic upgrade head
```

---

## Testing

### Create test_query_api.py

```python
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_create_query():
    response = client.post(
        "/api/query/",
        json={"question": "What is a black hole?"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "answer" in data
    assert "question" in data

def test_nasa_apod():
    response = client.get("/api/nasa/apod")
    assert response.status_code == 200
    data = response.json()
    assert "url" in data or "error" in data
```

### Run Tests

```bash
pytest tests/ -v
```

---

## Deployment

### Docker

Create `Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/cosmicquery
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - NASA_API_KEY=${NASA_API_KEY}
    depends_on:
      - db
      - redis
  
  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=cosmicquery
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

### Run with Docker

```bash
docker-compose up -d
```

---

## API Endpoints Summary

### Queries
- `POST /api/query/` - Submit a space query
- `GET /api/query/history` - Get query history (authenticated)

### NASA Data
- `GET /api/nasa/apod` - Get Astronomy Picture of the Day
- `GET /api/nasa/neo` - Get Near Earth Objects
- `GET /api/nasa/mars-photos` - Get Mars Rover photos

### Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/me` - Get current user profile

---

## Next Steps

1. **Implement Authentication**: Add JWT token-based authentication
2. **Add Rate Limiting**: Implement rate limiting for free tier users
3. **Stripe Integration**: Add payment processing for premium subscriptions
4. **WebSocket Support**: Add real-time notifications for celestial events
5. **Caching Layer**: Optimize with Redis caching
6. **Monitoring**: Add logging and monitoring with Sentry
7. **Documentation**: Expand API documentation with examples

---

## Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [NASA APIs](https://api.nasa.gov/)
- [OpenAI API Documentation](https://platform.openai.com/docs/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [Alembic Documentation](https://alembic.sqlalchemy.org/)

---

**Last Updated**: October 5, 2025
