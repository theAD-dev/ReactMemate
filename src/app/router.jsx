import { Suspense, lazy } from "react";
import { Navigate, RouteObject } from "react-router";
import SuspenseLoader from "../shared/ui/suspense-loader/suspense-loader";

const LazyLoader = (Component) => (props) =>
(
    <Suspense fallback={<SuspenseLoader />}>
        <Component {...props} />
    </Suspense>
);

// Pages
