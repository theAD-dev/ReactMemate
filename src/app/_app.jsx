import { ErrorBoundary } from "react-error-boundary";
import { HelmetProvider } from "react-helmet-async";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { PrimeReactProvider } from "primereact/api";
import { Toaster } from "sonner";
import { AuthProvider } from "./providers/auth-provider";
import { ReactQueryProvider } from "./providers/query-client-provider";
import "./global.scss";
import routes from "./router";

const App = () => {
  const content = createBrowserRouter(routes);

  return (
    <ErrorBoundary
      FallbackComponent={<>Error</>}
      onReset={() => window.location.replace("/")}
    >
      <HelmetProvider>
        <PrimeReactProvider>
          <ReactQueryProvider>
            <AuthProvider>
              <Toaster expand={true} richColors closeButton position="top-right" />
              <RouterProvider router={content} />
            </AuthProvider>
          </ReactQueryProvider>
        </PrimeReactProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
};

export default App;
