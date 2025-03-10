import React from "react";
import { Button } from "react-bootstrap";
import { useMutation } from "@tanstack/react-query";
import { ProgressSpinner } from "primereact/progressspinner";
import { toast } from "sonner";
import style from "./integration.module.scss";
import { disconnectXeroIntegrations } from "../../../../APIs/integrations-api";



const CLIENT_ID = "743BAB12B3A24534889C5C803A35E12C";
// const REDIRECT_URI = "http://localhost:3000/settings/integrations";

const XeroIntegration = ({ connected, refetch }) => {
  console.log('connected: ', connected);
  const REDIRECT_URI = window.location.href;
  const authorizationUrl = `https://login.xero.com/identity/connect/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=openid profile email offline_access accounting.transactions accounting.contacts accounting.settings&state=111`;

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
      if (data?.error) {
        toast.error(data?.error);
        return;
      }
      toast.success("Xero code has been sent successfully!");
    } catch (error) {
      console.error("Error saving template:", error);
      toast.error("Failed to send the xero code. Please try again.");
    } finally {
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
            exchangeCodeForToken(code);
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
    }, 500);
  };

  const mutation = useMutation({
    mutationFn: () => disconnectXeroIntegrations(),
    onSuccess: () => {
      refetch();
      toast.success(`Xero disconnected successfully.`);
    },
    onError: (error) => {
      console.log('error: ', error);
      toast.error(`Failed to disconnect xero. Please try again.`);
    }
  });

  return (
    <div>
      <div className={style.bottom}>
        {
          !connected ?
            <button onClick={handleButtonClick} className={style.infoButton}>Connect</button>
            : <Button onClick={() => mutation?.mutate()} className="danger-outline-button">
              Disconnect
              {mutation?.isPending && <ProgressSpinner style={{ width: '20px', height: '20px' }} />}
            </Button>
        }
      </div>
    </div>
  );
};

export default XeroIntegration;
