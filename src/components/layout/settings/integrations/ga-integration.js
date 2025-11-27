import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import style from './integration.module.scss';
import { getGaProperties } from "../../../../APIs/analytics-api";
import { useAuth } from '../../../../app/providers/auth-provider';

/**
 * Google Analytics integration card controller.
 * - Opens backend OAuth URL in a popup
 * - Polls link status until connected
 * - Reports status to parent via onStatus(boolean)
 */
const GaIntegration = ({ onStatus, refetch }) => {
  const [connecting, setConnecting] = useState(false);
  const [linked, setLinked] = useState(false);
  
  const { session } = useAuth();
  const uid = session?.id;

  const API_BASE = process.env.REACT_APP_BACKEND_API_URL;

  const reportStatus = useCallback((val) => {
    setLinked(val);
    if (typeof onStatus === "function") onStatus(val);
  }, [onStatus]);

  const checkLinked = useCallback(async () => {
    try {
      // Check properties endpoint; if it returns list, consider linked
      const p = await getGaProperties();
      const ok = Array.isArray(p?.properties) && p.properties.length > 0;
      reportStatus(ok);
      return ok;
    } catch (e) {
      // If properties endpoint fails, consider not linked
      reportStatus(false);
      return false;
    }
  }, [reportStatus]);

  useEffect(() => {
    // On mount, compute initial status
    checkLinked();
  }, [checkLinked]);

  const startOAuth = () => {
    if (!uid) {
      toast.error("Missing user id. Please login again.");
      return;
    }
    
    setConnecting(true);
    const oauthUrl = `${API_BASE}/analytics/auth/google?uid=${encodeURIComponent(uid)}&next=/settings/integrations`;
    const popup = window.open(oauthUrl, "GoogleAnalyticsOAuth", "width=600,height=700");

    if (!popup) {
      toast.error("Popup blocked. Please allow popups for this site.");
      setConnecting(false);
      return;
    }

    const timer = setInterval(async () => {
      try {
        // Check if linked (this will work even with cross-origin popup)
        const isLinked = await checkLinked();
        console.log('GA Link Status:', isLinked);
        
        if (isLinked) {
          // Close the popup and clear the interval
          popup.close();
          clearInterval(timer);
          setConnecting(false);
          toast.success("Google Analytics linked!");
          
          // Refetch to update UI
          if (refetch) {
            refetch();
          }
        }
      } catch (error) {
        console.log("Checking status...", error.message);
      }

      // Clear interval if the popup is closed before completion
      if (popup && popup.closed) {
        clearInterval(timer);
        setConnecting(false);
        
        // Do a final check after popup closes
        setTimeout(async () => {
          const finalCheck = await checkLinked();
          console.log('Final check after popup closed:', finalCheck);
          if (finalCheck) {
            toast.success("Google Analytics linked!");
            if (refetch) {
              refetch();
            }
          }
        }, 1000);
      }
    }, 500); // Check every 500ms like Xero
  };

  return (
    <div className={style.bottom}>
      {linked ? (
        <button disabled className={style.infoButton} style={{ opacity: 0.6 }}>
          Connected
        </button>
      ) : (
        <button onClick={startOAuth} disabled={connecting} className={style.infoButton}>
          {connecting ? "Connecting..." : "Connect"}
        </button>
      )}
    </div>
  );
};

export default GaIntegration;
