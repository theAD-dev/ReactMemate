import { ErrorBoundary } from "react-error-boundary";
import { HelmetProvider } from "react-helmet-async";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { PrimeReactProvider, addLocale } from "primereact/api";
import { Toaster } from "sonner";
import { AuthProvider } from "./providers/auth-provider";
import { ReactQueryProvider } from "./providers/query-client-provider";
import { TrialHeightProvider } from "./providers/trial-height-provider";
import routes from "./router";
import UnknownError from "../pages/error/unknown/unknown";

const App = () => {
  const content = createBrowserRouter(routes);
  addLocale('en', {
      firstDayOfWeek: 1,
  });

  return (
    <ErrorBoundary
      FallbackComponent={UnknownError}
      onReset={() => window.location.replace("/")}
    >
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
