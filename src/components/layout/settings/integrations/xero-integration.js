import React, { useState } from "react";
import style from "./integration.module.scss";
import { toast } from "sonner";

const CLIENT_ID = "743BAB12B3A24534889C5C803A35E12C";
// const REDIRECT_URI = "http://localhost:3000/settings/integrations";

const XeroIntegration = () => {
  const REDIRECT_URI = window.location.href;
  const authorizationUrl = `https://login.xero.com/identity/connect/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=openid profile email offline_access accounting.transactions accounting.contacts accounting.settings&state=111`;

  const [redirectParams, setRedirectParams] = useState(null);

  const processedCodes = new Set();
  const exchangeCodeForToken = async (code) => {
    if (processedCodes.has(code)) return;

    try {
      processedCodes.add(code);
      const accessToken = localStorage.getItem("access_token");

      const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/xero?code=${code}`, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      const data = await response.json();
      toast.success("Xero code has been sent successfully!");
    } catch (error) {
      console.error("Error saving template:", error);
      toast.error("Failed to send the xero code. Please try again.");
    }  finally {
        processedCodes.delete(code);
     }
  };

  const handleButtonClick = () => {
    // Open a new popup window for the Xero login page
    const popup = window.open(
      authorizationUrl,
      "Xero Login",
      "width=600,height=700"
    );

    const timer = setInterval(async () => {
      try {
        if (popup && popup.location.href.startsWith(REDIRECT_URI)) {
          const queryParams = new URLSearchParams(
            new URL(popup.location.href).search
          );
          const code = queryParams.get("code");
          const state = queryParams.get("state");

          if (code) {
            await exchangeCodeForToken(code)
            console.log("Authorization Code:", code);

            // Close the popup and clear the interval
            popup.close();
            clearInterval(timer);
          }
        }
      } catch (error) {
        // Cross-origin error until popup redirects to the same origin
        console.log("Waiting for redirect...", error.message);
      }

      // Clear interval if the popup is closed before redirect
      if (popup && popup.closed) {
        clearInterval(timer);
        console.log("Popup closed before completing login.");
      }
    }, 1000);
  };

  return (
    <div>
      <div className={style.bottom}>
        <button onClick={handleButtonClick} className={style.infoButton}>
          Connect
        </button>
      </div>

      {/* {redirectParams && (
        <div className={style.result}>
          <h6>Authorization Code:</h6>
          <p><strong>Code:</strong> {redirectParams.code}</p>
          <p><strong>State:</strong> {redirectParams.state}</p>
        </div>
      )} */}
    </div>
  );
};

export default XeroIntegration;
