import { createContext, useContext, useState, type ReactNode } from 'react';

interface AdminSidebarContextType {
    isCollapsed: boolean;
    setIsCollapsed: (collapsed: boolean) => void;
    isMobileOpen: boolean;
    setIsMobileOpen: (open: boolean) => void;
}

const AdminSidebarContext = createContext<AdminSidebarContextType | undefined>(undefined);

export function AdminSidebarProvider({ children }: { children: ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <AdminSidebarContext.Provider
            value={{
                isCollapsed,
                setIsCollapsed,
                isMobileOpen,
                setIsMobileOpen,
            }}
        >
            {children}
        </AdminSidebarContext.Provider>
    );
}

export function useAdminSidebar() {
    const context = useContext(AdminSidebarContext);
    if (context === undefined) {
        throw new Error('useAdminSidebar must be used within an AdminSidebarProvider');
    }
    return context;
}
