import requests
from fastapi import HTTPException
import os
from .. import config  # Keep for dotenv loading

class NASAService:
    BASE_URL = "https://api.nasa.gov"

    def __init__(self):
        # The API key will be fetched just-in-time inside the methods.
        pass

    def get_apod(self):
        """Fetches the Astronomy Picture of the Day from the NASA API."""
        api_key = os.getenv("NASA_API_KEY")
        if not api_key:
            raise HTTPException(
                status_code=500,
                detail="NASA_API_KEY is not configured on the server. Please check the .env file."
            )

        endpoint = f"{self.BASE_URL}/planetary/apod"
        params = {"api_key": api_key}

        try:
            response = requests.get(endpoint, params=params)
            response.raise_for_status()  # Raises an HTTPError for bad responses (4XX or 5XX)
            return response.json()
        except requests.exceptions.HTTPError as http_err:
            # Handle specific HTTP errors if needed
            raise HTTPException(status_code=response.status_code, detail=f"Error fetching data from NASA: {http_err}")
        except requests.exceptions.RequestException as req_err:
            # Handle other request errors (e.g., network issues)
            raise HTTPException(status_code=503, detail=f"Service Unavailable: Could not connect to NASA API. {req_err}")

# Create a single instance of the service to be used across the application
nasa_service = NASAService()
