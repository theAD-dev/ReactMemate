import React, { useState, useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { HelmetProvider } from "react-helmet-async";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { PrimeReactProvider, addLocale } from "primereact/api";
import { Toaster } from "sonner";
import { AuthProvider } from "./providers/auth-provider";
import { ReactQueryProvider } from "./providers/query-client-provider";
import { TrialHeightProvider } from "./providers/trial-height-provider";
import routes from "./router";
import SplashScreen from "./splash-screen/splash-screen";
import UnknownError from "../pages/error/unknown/unknown";
import '../shared/lib/pdf-worker';

const App = () => {
  const [showSplash, setShowSplash] = useState(() => {
    // Use window.name to persist across hard refresh but clear on tab close
    // window.name persists as long as the tab is open
    return window.name !== 'meMate_splash_shown';
  });
  const content = createBrowserRouter(routes);
  
  useEffect(() => {
    addLocale('en', {
        firstDayOfWeek: 1,
    });
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
    // Set window.name so splash won't show again in this tab
    window.name = 'meMate_splash_shown';
  };

  return (
    <ErrorBoundary
      FallbackComponent={UnknownError}
      onReset={() => window.location.replace("/")}
    >
      <SplashScreen 
        isVisible={showSplash} 
        onComplete={handleSplashComplete} 
      />
      <HelmetProvider>
        <PrimeReactProvider>
          <ReactQueryProvider>
            <AuthProvider>
              <TrialHeightProvider>
                <Toaster expand={true} richColors closeButton position="top-right" />
                <RouterProvider router={content} future={{
                  v7_relativeSplatPath: true,
                  v7_startTransition: true,
                }} />
              </TrialHeightProvider>
            </AuthProvider>
          </ReactQueryProvider>
        </PrimeReactProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
};

export default App;
