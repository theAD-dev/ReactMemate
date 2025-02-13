import { PrimeReactProvider } from "primereact/api";
import { createBrowserRouter, RouterProvider, } from 'react-router-dom';
import { ReactQueryProvider } from "./providers/query-client-provider";
import { ErrorBoundary } from "react-error-boundary";
import { HelmetProvider } from 'react-helmet-async';

import routes from "./router";
import './global.scss';
import '@/shared/styles/bootstrap.scss';
import '@/shared/styles/prime.scss';
import { AuthProvider } from "./providers/auth-provider";
import { UnknownError } from "@/pages/error/unknown/unknown-error";
import { Toaster } from 'sonner'

const App = () => {
  useDisableScreenshots()
  useDisableRightClickAndDevTools();
  const content = createBrowserRouter(routes);
  const isRecording = useScreenRecordingDetector();

  return (
    <ErrorBoundary FallbackComponent={UnknownError} onReset={() => window.location.replace('/')}>
      <HelmetProvider>
        <PrimeReactProvider>
          <ReactQueryProvider>
            <AuthProvider>
              {/* Conditional rendering based on isRecording */}
              {isRecording && (
                <div className="recording-warning">
                  <p>Screen recording detected. Some features may be restricted.</p>
                </div>
              )}
              <Toaster
                className="snackbar"
                position="top-right"
                expand
                closeButton
                duration={5000}
                visibleToasts={2}
                toastOptions={{
                  classNames: {
                    success: 'snack-bar-success',
                    error: 'snack-bar-error',
                    closeButton: 'snack-bar-action-button',
                    content: 'snackbar-content',
                    title: 'snackbar-title',
                  },
                }}
              />
              <div className={isRecording ? "blur-content" : ""}>
                <RouterProvider router={content} />
              </div>
            </AuthProvider>
          </ReactQueryProvider>
        </PrimeReactProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
};

export default App;