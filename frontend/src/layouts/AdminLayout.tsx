import { Outlet } from 'react-router-dom';

export default function AdminLayout() {
    return (
        <div className="min-h-screen w-full flex flex-col bg-slate-950">
            <header className="bg-linear-to-r from-slate-900 to-slate-800 px-6 py-4 shadow-lg border-b-2 border-rose-500">
                <nav>
                    <span className="text-xl font-bold text-rose-500 tracking-tight">Gymly Admin</span>
                </nav>
            </header>
            <main className="flex-1 p-6 flex flex-col items-center justify-center">
                <Outlet />
            </main>
        </div>
    );
}
