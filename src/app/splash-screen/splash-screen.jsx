import React, { useState, useEffect } from 'react';
import styles from './splash-screen.module.scss';

const SplashScreen = ({ isVisible, onComplete }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (isVisible) {
      // Show splash for 3 seconds then fade out
      const timer = setTimeout(() => {
        setFadeOut(true);
      }, 5000);

      // Remove completely after fade animation
      const removeTimer = setTimeout(() => {
        onComplete?.();
      }, 5500); // 5000ms + 500ms fade animation

      return () => {
        clearTimeout(timer);
        clearTimeout(removeTimer);
      };
    }
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  // Add cache-busting parameter to force fresh GIF load
  const gifUrl = `https://memate-website.s3.ap-southeast-2.amazonaws.com/assets/logos/MeMate-Grey-BG-675x75.gif?t=${Date.now()}`;

  return (
    <div className={`${styles.splashScreen} ${fadeOut ? styles.fadeOut : ''}`}>
      <div className={styles.splashContent}>
        <img 
          src={gifUrl}
          alt="MeMate" 
          className={styles.logo}
        />
      </div>
    </div>
  );
};

export default SplashScreen;
