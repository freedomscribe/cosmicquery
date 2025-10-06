from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import nasa, query

app = FastAPI(
    title="CosmicQuery API",
    description="API for fetching astronomical data and processing AI queries.",
    version="1.0.0",
)

# Configure CORS
origins = [
    "http://localhost:5173",  # The origin of your React frontend
    "http://localhost:3000",  # Another common frontend dev port
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Include API routers
app.include_router(nasa.router, prefix="/api/nasa")
app.include_router(query.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to the CosmicQuery API"}
