import { useEffect } from "react";
import OneSignal from "react-onesignal";
import { useAuth } from "../auth/AuthContext";

export default function OneSignalInit() {

  const { user } = useAuth(); // assuming you store logged-in user

  useEffect(() => {

    async function initOneSignal() {

      await OneSignal.init({
        appId: "YOUR_ONESIGNAL_APP_ID",
        notifyButton: { enable: true },
      });

      // Ask permission
      OneSignal.showSlidedownPrompt();

      // Link device with backend user id
      if (user?.id) {
        await OneSignal.login(user.id.toString());
      }
    }

    initOneSignal();

  }, [user]);

  return null;
}
