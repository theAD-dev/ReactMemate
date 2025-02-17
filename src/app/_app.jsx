import { Toaster } from "sonner";
import { PrimeReactProvider } from "primereact/api";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ReactQueryProvider } from "./providers/query-client-provider";
import { ErrorBoundary } from "react-error-boundary";
import { HelmetProvider } from "react-helmet-async";

import "./global.scss";
import routes from "./router";
import { AuthProvider } from "./providers/auth-provider";

const App = () => {
  useDisableScreenshots();
  useDisableRightClickAndDevTools();
  const content = createBrowserRouter(routes);
  const isRecording = useScreenRecordingDetector();

  return (
    <ErrorBoundary
      FallbackComponent={<>Error</>}
      onReset={() => window.location.replace("/")}
    >
      <HelmetProvider>
        <PrimeReactProvider>
          <ReactQueryProvider>
            <AuthProvider>
              <Toaster
                className="snackbar"
                position="top-right"
                expand
                closeButton
                duration={5000}
                visibleToasts={2}
                toastOptions={{
                  classNames: {
                    success: "snack-bar-success",
                    error: "snack-bar-error",
                    closeButton: "snack-bar-action-button",
                    content: "snackbar-content",
                    title: "snackbar-title",
                  },
                }}
              />
              <RouterProvider router={content} />
            </AuthProvider>
          </ReactQueryProvider>
        </PrimeReactProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
};

export default App;
