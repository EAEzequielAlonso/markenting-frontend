'use client';

import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { useAuth } from '@/context/AuthContext';
import { SidebarProvider } from '@/context/SidebarContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) {
        return null; // Prevents flash of content before redirect
    }

    return (
        <SidebarProvider>
            <div className="flex h-screen bg-white overflow-hidden">
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Header />
                    <main className="flex-1 overflow-y-auto p-4 md:p-6 transition-all duration-200 ease-in-out">
                        {children}
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}
