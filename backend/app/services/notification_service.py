import requests
from app.core.config import settings

ONESIGNAL_URL = "https://onesignal.com/api/v1/notifications"


def send_push_notification(user_id: int, title: str, message: str):

    payload = {
        "app_id": settings.ONESIGNAL_APP_ID,
        "include_external_user_ids": [str(user_id)],
        "headings": {"en": title},
        "contents": {"en": message},
    }

    headers = {
        "Authorization": settings.ONESIGNAL_API_KEY,
        "Content-Type": "application/json",
    }

    try:
        response = requests.post(ONESIGNAL_URL, json=payload, headers=headers)
        response.raise_for_status()
    except Exception as e:
        print("Notification failed:", e)
