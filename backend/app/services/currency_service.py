import requests

CURRENCY_API = "https://api.exchangerate-api.com/v4/latest/INR"

def get_exchange_rates():

    response = requests.get(CURRENCY_API)

    data = response.json()

    return data["rates"]
