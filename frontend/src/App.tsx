import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';
import UserHomePage from './pages/user/HomePage';
import MyCheckInsPage from './pages/user/MyCheckInsPage';
import MySubscriptionsPage from './pages/user/MySubscriptionsPage';
import PackagesPage from './pages/user/PackagesPage';
import ProfilePage from './pages/user/ProfilePage';
import NotificationsPage from './pages/user/NotificationsPage';
import AdminHomePage from './pages/admin/HomePage';
import AdminCheckInsPage from './pages/admin/CheckInsPage';
import AdminSubscriptionsPage from './pages/admin/SubscriptionsPage';
import LoginPage from './pages/LoginPage';

const queryClient = new QueryClient();
function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
    const { isAuthenticated, isLoading, user } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}

function AppRoutes() {
    const { isAuthenticated, isLoading, user } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <Routes>
            {/* Public route - Login */}
            <Route
                path="/login"
                element={
                    isAuthenticated ? <Navigate to={user?.role === 'admin' ? '/admin' : '/'} replace /> : <LoginPage />
                }
            />

            {/* User routes */}
            <Route
                element={
                    <ProtectedRoute allowedRoles={['member']}>
                        <UserLayout />
                    </ProtectedRoute>
                }
            >
                <Route path="/" element={<UserHomePage />} />
                <Route path="/my-checkins" element={<MyCheckInsPage />} />
                <Route path="/my-subscriptions" element={<MySubscriptionsPage />} />
                <Route path="/packages" element={<PackagesPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
            </Route>

            {/* Admin routes */}
            <Route
                path="/admin"
                element={
                    <ProtectedRoute allowedRoles={['admin', 'staff']}>
                        <AdminLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<AdminHomePage />} />
                <Route path="checkins" element={<AdminCheckInsPage />} />
                <Route
                    path="subscriptions"
                    element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <AdminSubscriptionsPage />
                        </ProtectedRoute>
                    }
                />
            </Route>
        </Routes>
    );
}

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <AuthProvider>
                    <AppRoutes />
                </AuthProvider>
            </BrowserRouter>
        </QueryClientProvider>
    );
}

export default App;
