import { JWT } from "google-auth-library";
import { GOOGLE_APPLICATION_CREDENTIALS } from "./config/environment.js";
import * as fs from "fs";
const SCOPES = ["https://www.googleapis.com/auth/firebase.messaging"];

export async function getAccessToken() {
  console.log(GOOGLE_APPLICATION_CREDENTIALS);

  try {
    const key = JSON.parse(
      fs.readFileSync(GOOGLE_APPLICATION_CREDENTIALS, "utf8")
    );
    const jwtClient = new JWT(
      key.client_email,
      null,
      key.private_key,
      SCOPES,
      null
    );
    console.log(jwtClient);
    const tokens = await jwtClient.authorize();
    return tokens.access_token;
  } catch (error) {
    console.error("Error getting access token:", error);
    throw error;
  }
}

export async function sendNotification(notificationToken, title, body, data) {
  console.log("notificationToken:", notificationToken);
  console.log("title:", title);
  console.log("body:", body);
  console.log("data:", data);

  try {
    const accessToken = await getAccessToken();
    console.log("accessToken:", accessToken);

    const response = await fetch(
      "https://fcm.googleapis.com/v1/projects/uflow-medusa/messages:send",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          message: {
            token: notificationToken,
            notification: {
              title,
              body,
            },
            data: data || {},
            android: {
              direct_boot_ok: true,
            },
          },
        }),
      }
    );

    console.log("response:", response);

    if (!response.ok) {
      console.error("FCM Error:", await response.text());
      throw new Error(`FCM API responded with status: ${response.status}`);
    }

    return;
  } catch (error) {
    console.error("Error sending notification:", error);
    throw error;
  }
}
