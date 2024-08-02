import requests
import logging
from .config import API_KEY

BASE_URL = "https://api.cricapi.com/v1/"

# Configure logging
logging.basicConfig(level=logging.ERROR, format='%(asctime)s - %(levelname)s - %(message)s')

def get_player_statistics(player_id):
    """
    Function to retrieve player statistics from the CricAPI.
    :param player_id: ID of the player to retrieve statistics for
    :return: JSON response containing player statistics or error message
    """
    url = f"{BASE_URL}players_info"
    params = {
        "apikey": API_KEY,
        "id": player_id
    }

    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.HTTPError as http_err:
        logging.error(f"HTTP error occurred: {http_err}")
        return {"error": f"HTTP error occurred: {http_err}"}
    except Exception as err:
        logging.error(f"An error occurred: {err}")
        return {"error": f"An error occurred: {err}"}

def test_api_integration():
    """
    Function to test the API integration by making a sample API call
    """
    # Use a sample player ID for testing (Virat Kohli's ID from the API documentation)
    sample_player_id = "16592242-ef26-45d9-bf23-fc090e90fbbe"
    result = get_player_statistics(sample_player_id)
    if "error" in result:
        print(f"API test failed: {result['error']}")
    else:
        print("API test successful. Sample player statistics retrieved.")
        print(result)

if __name__ == "__main__":
    test_api_integration()
