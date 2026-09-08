import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
} from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AuthCallback from "./auth/AuthCallback";
import { isAuthenticated } from "./auth/auth";
import Organizations from "./pages/Organizations";
import OrganizationDetails from "./pages/OrganizationDetails";
import CreateEvent from "./pages/CreateEvent";
import EventDetails from "./pages/EventDetails";
import EditEvent from "./pages/EditEvent";
import EventDiscovery from "./pages/EventDiscovery";

function ProtectedRoute({children,}: {
    children: React.ReactNode;
}) {
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/oauth/callback"
                    element={<AuthCallback />}
                />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                  path="/organizations"
                  element={
                      <ProtectedRoute>
                          <Organizations />
                      </ProtectedRoute>
                  }
                />

                <Route
                    path="/organizations/:organizationId"
                    element={
                        <ProtectedRoute>
                            <OrganizationDetails />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/organizations/:organizationId/events/create"
                    element={
                        <ProtectedRoute>
                            <CreateEvent />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/organizations/:organizationId/events/:eventId"
                    element={
                        <ProtectedRoute>
                            <EventDetails />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/events"
                    element={
                        <ProtectedRoute>
                            <EventDiscovery />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/organizations/:organizationId/events/:eventId/edit"
                    element={
                        <ProtectedRoute>
                            <EditEvent />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/"
                    element={<Navigate to="/dashboard" replace />}
                />

                <Route
                    path="*"
                    element={<Navigate to="/dashboard" replace />}
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;