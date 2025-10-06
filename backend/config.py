import os
from dotenv import load_dotenv
from pathlib import Path

# Define the base directory of the backend
# This makes the path resolution independent of where the script is run
BASE_DIR = Path(__file__).resolve().parent

# Explicitly specify the path to the .env file
dotenv_path = BASE_DIR / '.env'
load_dotenv(dotenv_path=dotenv_path)
