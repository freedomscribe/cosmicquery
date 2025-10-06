from fastapi import APIRouter, Depends
from ..services.nasa_service import NASAService, nasa_service

router = APIRouter()

@router.get("/apod", tags=["NASA"])
def get_astronomy_picture_of_the_day(service: NASAService = Depends(lambda: nasa_service)):
    """Endpoint to get the Astronomy Picture of the Day."""
    return service.get_apod()
