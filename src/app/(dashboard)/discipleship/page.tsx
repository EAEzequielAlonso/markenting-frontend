'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar, User, ArrowRight, Loader2, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { DiscipleshipDialog } from '@/components/discipleship/DiscipleshipDialog';
import { DiscipleshipRole, DiscipleshipStatus } from '@/types/discipleship';

export default function DiscipleshipPage() {
    const [discipleships, setDiscipleships] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('ACTIVE'); // ACTIVE, PAUSED, COMPLETED
    const { user } = useAuth();
    const router = useRouter();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        fetchDiscipleships();
    }, []);

    const fetchDiscipleships = async () => {
        try {
            const res = await api.get('/discipleships');
            setDiscipleships(res.data);
        } catch (error) {
            toast.error('Error cargando discipulados');
        } finally {
            setLoading(false);
        }
    };

    const filtered = discipleships.filter(d => {
        if (filter === 'ALL') return true;
        return d.status === filter;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case DiscipleshipStatus.ACTIVE: return <Badge className="bg-green-600">Activo</Badge>;
            case DiscipleshipStatus.PAUSED: return <Badge variant="secondary" className="bg-orange-100 text-orange-800">Pausado</Badge>;
            case DiscipleshipStatus.COMPLETED: return <Badge variant="secondary">Completado</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

    return (
        <div className="space-y-6 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-full">
                        <GraduationCap className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Discipulados</h1>
                        <p className="text-slate-500 mt-1">Gestión de procesos de crecimiento espiritual.</p>
                    </div>
                </div>
                <Button onClick={() => setIsDialogOpen(true)} className="bg-indigo-600 hover:bg-indigo-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Iniciar Nuevo
                </Button>
            </div>

            {/* Filters */}
            <div className="flex gap-2 border-b border-gray-100 pb-1 overflow-x-auto">
                {['ACTIVE', 'PAUSED', 'COMPLETED', 'ALL'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${filter === f
                            ? 'border-indigo-600 text-indigo-600 bg-indigo-50'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        {f === 'ACTIVE' ? 'Activos' : f === 'PAUSED' ? 'Pausados' : f === 'COMPLETED' ? 'Completados' : 'Todos'}
                    </button>
                ))}
            </div>

            {/* List */}
            {filtered.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <div className="flex justify-center mb-4">
                        <GraduationCap className="w-12 h-12 text-gray-300" />
                    </div>
                    <p className="text-gray-500 text-lg font-medium">No hay discipulados {filter !== 'ALL' ? 'en esta categoría' : ''}.</p>
                    <p className="text-gray-400 text-sm mt-1">Comienza uno nuevo para impulsar el crecimiento.</p>
                    {filter === 'ACTIVE' && (
                        <Button variant="link" onClick={() => setIsDialogOpen(true)} className="mt-2 text-indigo-600">
                            Iniciar proceso
                        </Button>
                    )}
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filtered.map((item) => {
                        // Logic to show roles
                        const disciplers = item.participants.filter((p: any) => p.role === DiscipleshipRole.DISCIPLER);
                        const disciples = item.participants.filter((p: any) => p.role === DiscipleshipRole.DISCIPLE);
                        const myParticipation = item.participants.find((p: any) => p.member?.person?.id === user?.personId);
                        const isMyRole = myParticipation?.role;

                        return (
                            <Card key={item.id} className="hover:shadow-lg transition-all cursor-pointer group border-l-4 border-l-indigo-500" onClick={() => router.push(`/discipleship/${item.id}`)}>
                                <CardContent className="p-5 flex flex-col gap-4">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                {getStatusBadge(item.status)}
                                                {item.name && <span className="font-semibold text-gray-900 truncate max-w-[150px]">{item.name}</span>}
                                            </div>
                                            <p className="text-xs text-gray-400">Iniciado: {new Date(item.startDate).toLocaleDateString()}</p>
                                        </div>
                                        {isMyRole && (
                                            <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
                                                {isMyRole === 'SUPERVISOR' ? 'Supervisor' : isMyRole === 'DISCIPLER' ? 'Discipulador' : 'Discípulo'}
                                            </Badge>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        {/* Participants visualization */}
                                        <div className="p-3 bg-slate-50 rounded-lg space-y-2">
                                            <div className="flex flex-col gap-1 text-sm">
                                                {disciplers.length > 0 ? disciplers.map((d: any) => (
                                                    <div key={d.id} className="flex items-center gap-2">
                                                        <User className="w-4 h-4 text-indigo-500" />
                                                        <span className="font-medium text-slate-700">{d.member?.person?.fullName}</span>
                                                    </div>
                                                )) : (
                                                    <div className="flex items-center gap-2">
                                                        <User className="w-4 h-4 text-indigo-500" />
                                                        <span className="font-medium text-slate-700">Sin discipulador</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="pl-6 space-y-1">
                                                {disciples.map((d: any) => (
                                                    <div key={d.id} className="flex items-center gap-2 text-xs text-slate-500">
                                                        <ArrowRight className="w-3 h-3 text-pink-400" />
                                                        <span>{d.member?.person?.fullName}</span>
                                                    </div>
                                                ))}
                                                {disciples.length === 0 && <span className="text-xs text-gray-300 italic">Sin discípulos</span>}
                                            </div>
                                        </div>
                                    </div>

                                    {item.objective && (
                                        <p className="text-xs text-gray-500 line-clamp-2 italic border-t pt-2 mt-auto">
                                            "{item.objective}"
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

            <DiscipleshipDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onSuccess={fetchDiscipleships}
            />
        </div>
    );
}
