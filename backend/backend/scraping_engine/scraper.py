import os
import requests
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

SCRAPE_NINJA_URL = os.getenv("SCRAPE_NINJA_URL")
RAPID_API_HOST = os.getenv("RAPID_API_HOST")
RAPID_API_KEY = os.getenv("RAPID_API_KEY")

def scrape_website(url, geo="us", retry_num=1):
    headers = {
        "X-RapidAPI-Host": RAPID_API_HOST,
        "X-RapidAPI-Key": RAPID_API_KEY,
        "Content-Type": "application/json",
    }

    body = {
        "url": url,
        "geo": geo,
        "retryNum": retry_num,
    }

    try:
        response = requests.post(SCRAPE_NINJA_URL, headers=headers, json=body)
        response.raise_for_status()  # Raise an error for bad responses (4xx and 5xx)
        return response.json()  # Return the JSON response
    except requests.exceptions.HTTPError as errh:
        print("HTTP Error:", errh)
        return None
    except requests.exceptions.ConnectionError as errc:
        print("Error Connecting:", errc)
        return None
    except requests.exceptions.Timeout as errt:
        print("Timeout Error:", errt)
        return None
    except requests.exceptions.RequestException as err:
        print("Request Error:", err)
        return None
