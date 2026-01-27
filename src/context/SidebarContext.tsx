'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface SidebarContextType {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    isMobileOpen: boolean;
    setIsMobileOpen: (open: boolean) => void;
    toggleSidebar: () => void;
    toggleMobileSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(true);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const pathname = usePathname();

    // Close mobile sidebar on route change
    useEffect(() => {
        setIsMobileOpen(false);
    }, [pathname]);

    const toggleSidebar = () => setIsOpen(!isOpen);
    const toggleMobileSidebar = () => setIsMobileOpen(!isMobileOpen);

    return (
        <SidebarContext.Provider
            value={{
                isOpen,
                setIsOpen,
                isMobileOpen,
                setIsMobileOpen,
                toggleSidebar,
                toggleMobileSidebar
            }}
        >
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebar() {
    const context = useContext(SidebarContext);
    if (context === undefined) {
        throw new Error('useSidebar must be used within a SidebarProvider');
    }
    return context;
}
