import { Suspense } from "react";
import SuspenseLoader from "../suspense-loader/suspense-loader";

export const LazyLoader = (Component) => (props) =>
(
    <Suspense fallback={<SuspenseLoader />}>
        <Component {...props} />
    </Suspense>
);