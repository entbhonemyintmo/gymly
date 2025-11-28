import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';
import UserHomePage from './pages/user/HomePage';
import AdminHomePage from './pages/admin/HomePage';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* User routes */}
                <Route element={<UserLayout />}>
                    <Route path="/" element={<UserHomePage />} />
                </Route>

                {/* Admin routes */}
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminHomePage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
