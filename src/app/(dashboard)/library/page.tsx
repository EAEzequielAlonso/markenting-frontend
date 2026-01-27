'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from 'lucide-react';
import { BookCatalog } from '@/components/library/BookCatalog';
import { LoansManagement } from '@/components/library/LoansManagement';
import { LoanBookDialog } from '@/components/library/LoanBookDialog'; // Admin action
import { CreateBookDialog } from '@/components/library/CreateBookDialog';

export default function LibraryPage() {
    const { token, churchId, user } = useAuth();
    const [refreshKey, setRefreshKey] = useState(0);

    const handleRefresh = () => setRefreshKey(prev => prev + 1);

    const canManage = user?.roles?.includes('PASTOR') || user?.roles?.includes('LEADER') || user?.roles?.includes('ELDER') || user?.roles?.includes('ADMIN');

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Biblioteca</h1>
                {canManage && (
                    <CreateBookDialog onBookCreated={handleRefresh} />
                )}
            </div>

            <Tabs defaultValue="catalog">
                <TabsList>
                    <TabsTrigger value="catalog">Catálogo</TabsTrigger>
                    <TabsTrigger value="my-loans">Mis Préstamos</TabsTrigger>
                    {canManage && <TabsTrigger value="loans">Gestión de Préstamos</TabsTrigger>}
                </TabsList>

                <TabsContent value="catalog" className="mt-6">
                    <BookCatalog refreshKey={refreshKey} onRefresh={handleRefresh} />
                </TabsContent>

                <TabsContent value="my-loans" className="mt-6">
                    <div className="text-gray-500">Próximamente: Historial de mis préstamos.</div>
                </TabsContent>

                {canManage && (
                    <TabsContent value="loans" className="mt-6">
                        <LoansManagement />
                    </TabsContent>
                )}
            </Tabs>
        </div>
    );
}
