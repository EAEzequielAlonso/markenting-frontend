'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Users,
    Plus,
    MoreVertical,
    ChevronRight,
    Settings2,
    Activity,
    ShieldCheck
} from "lucide-react";
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Ministry } from '@/types/ministry';

import { CreateMinistryDialog } from './create-ministry-dialog';

export default function MinistriesPage() {
    const router = useRouter();
    const [ministries, setMinistries] = useState<Ministry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

    useEffect(() => {
        fetchMinistries();
    }, []);

    const fetchMinistries = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ministries`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Error al cargar ministerios');
            const data = await res.json();
            setMinistries(data);
        } catch (error) {
            console.error(error);
            toast.error('No se pudieron cargar los ministerios');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto p-4 md:p-0">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Ministerios</h1>
                    <p className="text-slate-500 font-medium">Gestión estratégica y operativa de los equipos de servicio.</p>
                </div>

                <Button
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="font-bold gap-2 shadow-xl shadow-primary/20 h-12 px-6 rounded-2xl transition-all hover:scale-105 active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    Nuevo Ministerio
                </Button>
            </div>

            <CreateMinistryDialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
                onSuccess={fetchMinistries}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ministries.map((ministry) => (
                    <Card
                        key={ministry.id}
                        className="group relative overflow-hidden border-none shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer bg-white ring-1 ring-slate-200/50"
                        onClick={() => router.push(`/ministries/${ministry.id}`)}
                    >
                        {/* Status bar */}
                        <div
                            className="absolute top-0 left-0 w-full h-1.5 transition-all group-hover:h-2"
                            style={{ backgroundColor: ministry.color || '#3b82f6' }}
                        ></div>

                        <CardHeader className="pt-8 pb-4">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <CardTitle className="text-xl font-bold text-slate-800">{ministry.name}</CardTitle>
                                        <Badge variant={ministry.status === 'active' ? 'default' : 'secondary'} className="text-[10px] px-1.5 py-0 font-bold uppercase tracking-tighter">
                                            {ministry.status === 'active' ? 'Activo' : 'Inactivo'}
                                        </Badge>
                                    </div>
                                    <CardDescription className="line-clamp-2 text-sm leading-relaxed">
                                        {ministry.description || 'Sin descripción disponible.'}
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-6 pt-0">
                            {/* Leader Info */}
                            <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3 border border-slate-100/50">
                                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center border border-slate-200/60 overflow-hidden">
                                    {ministry.leader?.person.avatarUrl ? (
                                        <img src={ministry.leader.person.avatarUrl} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <ShieldCheck className="w-5 h-5 text-indigo-500" />
                                    )}
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Líder</p>
                                    <p className="text-sm font-bold text-slate-700">
                                        {ministry.leader ? `${ministry.leader.person.firstName} ${ministry.leader.person.lastName}` : 'No asignado'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                                <div className="flex items-center gap-4">
                                    <div className="flex flex-col">
                                        <span className="text-lg font-black text-slate-900">{ministry.members?.length || 0}</span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Integrantes</span>
                                    </div>
                                    <div className="w-px h-8 bg-slate-100"></div>
                                    <div className="flex flex-col">
                                        <span className="text-lg font-black text-slate-900">{ministry.tasks?.length || 0}</span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Misiones</span>
                                    </div>
                                </div>

                                <div className="h-10 w-10 rounded-full flex items-center justify-center bg-slate-50 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                    <ChevronRight className="w-5 h-5" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {ministries.length === 0 && (
                    <Card className="col-span-full border-dashed py-20 text-center bg-slate-50/50">
                        <Users className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-700">No hay ministerios registrados</h3>
                        <p className="text-slate-500 max-w-sm mx-auto mt-2">Comienza creando un ministerio para organizar tus equipos de servicio.</p>
                        <Button
                            variant="outline"
                            className="mt-6 font-bold border-2"
                            onClick={() => setIsCreateDialogOpen(true)}
                        >
                            Crear Primer Ministerio
                        </Button>
                    </Card>
                )}
            </div>
        </div>
    );
}
