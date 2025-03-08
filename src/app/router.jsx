import ProtectedRoute from "./providers/protected-route-provider";

const routes = [
    {
        path: "/",
        element: (
            <ProtectedRoute>
                <>Welcome</>
            </ProtectedRoute>
        ),
    },
];

export default routes;