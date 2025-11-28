import { Outlet } from 'react-router-dom';

export default function UserLayout() {
    return (
        <div className="min-h-screen w-full flex flex-col bg-gray-50">
            <header className="bg-linear-to-r from-violet-600 to-purple-600 px-6 py-4 shadow-lg">
                <nav>
                    <span className="text-xl font-bold text-white tracking-tight">Gymly</span>
                </nav>
            </header>
            <main className="flex-1 p-6 flex flex-col items-center justify-center">
                <Outlet />
            </main>
        </div>
    );
}
