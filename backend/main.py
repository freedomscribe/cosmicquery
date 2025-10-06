from fastapi import FastAPI
from .api import nasa

app = FastAPI(
    title="CosmicQuery API",
    description="API for fetching astronomical data and processing AI queries.",
    version="1.0.0",
)

# Include the NASA API router
app.include_router(nasa.router, prefix="/api/nasa")

@app.get("/")
def read_root():
    return {"message": "Welcome to the CosmicQuery API"}
