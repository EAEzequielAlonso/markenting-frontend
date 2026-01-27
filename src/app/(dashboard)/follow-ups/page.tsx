'use client';

import { useState } from 'react';
import PageContainer from '@/components/ui/PageContainer';
import { Button } from '@/components/ui/button';
import { UserPlus, Filter, Users, Archive, EyeOff } from 'lucide-react';
import useSWR from 'swr';
import api from '@/lib/api';
import FollowUpCard from '@/components/follow-ups/FollowUpCard';
import CreateFollowUpDialog from '@/components/follow-ups/CreateFollowUpDialog';
import AssignMemberDialog from '@/components/follow-ups/AssignMemberDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function FollowUpsPage() {
    const { user } = useAuth();
    const canManage = user?.roles?.some(r => ['ADMIN_APP', 'PASTOR', 'DEACON'].includes(r));

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [assigningPerson, setAssigningPerson] = useState<any>(null);

    // Default tab based on role? Admin usually "ACTIVE", Member sees what they have.
    // If Admin: "ACTIVE" shows all active.
    // If Member: "ACTIVE" shows their active assignments.
    const [activeTab, setActiveTab] = useState('ACTIVE');

    const { data: people, isLoading, mutate } = useSWR(`/follow-ups?status=${activeTab}`, async (url) => (await api.get(url)).data);

    const handleAssign = (person: any) => {
        setAssigningPerson(person);
    };

    const handleStatusChange = async (id: string, status: string) => {
        try {
            await api.put(`/follow-ups/${id}/status`, { status });
            toast.success(`Estado actualizado`);
            mutate();
        } catch (error) {
            toast.error('Error al cambiar estado');
        }
    };

    const handleSuccess = () => {
        mutate();
    };

    return (
        <PageContainer
            title="Seguimiento Pastoral"
            description="Gestión y acompañamiento de visitantes y nuevos creyentes."
            headerAction={
                canManage && (
                    <Button onClick={() => setIsCreateOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Nuevo Ingreso
                    </Button>
                )
            }
        >
            <div className="max-w-5xl mx-auto mt-6">

                {/* Info Alert for Members */}
                {!canManage && (
                    <Alert className="mb-6 bg-indigo-50 border-indigo-100 text-indigo-800">
                        <Users className="h-4 w-4" />
                        <AlertTitle>Mis Asignaciones</AlertTitle>
                        <AlertDescription>
                            Aquí verás las personas que te han sido asignadas para realizar seguimiento y acompañamiento.
                        </AlertDescription>
                    </Alert>
                )}

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-8 max-w-md mx-auto">
                        <TabsTrigger value="ACTIVE" className="font-semibold">
                            <Users className="w-4 h-4 mr-2 text-indigo-500" />
                            Activos
                        </TabsTrigger>
                        <TabsTrigger value="FINISHED" className="font-semibold">
                            <Archive className="w-4 h-4 mr-2 text-emerald-500" />
                            Finalizados
                        </TabsTrigger>
                        {canManage && (
                            <TabsTrigger value="HIDDEN" className="font-semibold">
                                <EyeOff className="w-4 h-4 mr-2 text-slate-500" />
                                Ocultos
                            </TabsTrigger>
                        )}
                    </TabsList>

                    <TabsContent value="ACTIVE" className="space-y-6">
                        {isLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-40 w-full rounded-xl" />)}
                            </div>
                        ) : people?.length === 0 ? (
                            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
                                <Users className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-slate-600">No hay seguimientos activos</h3>
                                <p className="text-slate-400 mt-1">
                                    {canManage ? 'Registra una nueva persona para comenzar.' : 'No tienes asignaciones pendientes.'}
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {people?.map((person: any) => (
                                    <FollowUpCard
                                        key={person.id}
                                        person={person}
                                        onAssign={handleAssign}
                                        onStatusChange={handleStatusChange}
                                    />
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="FINISHED" className="space-y-6">
                        {/* Similar structure for FINISHED */}
                        {isLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-40 w-full rounded-xl" />)}
                            </div>
                        ) : people?.length === 0 ? (
                            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
                                <Archive className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-slate-600">Sin historial</h3>
                                <p className="text-slate-400 mt-1">Aquí verás los seguimientos completados.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {people?.map((person: any) => (
                                    <FollowUpCard
                                        key={person.id}
                                        person={person}
                                        onAssign={handleAssign}
                                        onStatusChange={handleStatusChange}
                                    />
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    {canManage && (
                        <TabsContent value="HIDDEN" className="space-y-6">
                            {isLoading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-40 w-full rounded-xl" />)}
                                </div>
                            ) : people?.length === 0 ? (
                                <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
                                    <EyeOff className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-slate-600">Papelera vacía</h3>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {people?.map((person: any) => (
                                        <FollowUpCard
                                            key={person.id}
                                            person={person}
                                            onAssign={handleAssign}
                                            onStatusChange={handleStatusChange}
                                        />
                                    ))}
                                </div>
                            )}
                        </TabsContent>
                    )}
                </Tabs>
            </div>

            <CreateFollowUpDialog
                open={isCreateOpen}
                onOpenChange={setIsCreateOpen}
                onSuccess={handleSuccess}
            />

            {assigningPerson && (
                <AssignMemberDialog
                    open={!!assigningPerson}
                    onOpenChange={(open) => !open && setAssigningPerson(null)}
                    onSuccess={handleSuccess}
                    person={assigningPerson}
                />
            )}
        </PageContainer>
    );
}
