'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar, User, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

export default function CounselingPage() {
    const [processes, setProcesses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ACTIVE'); // ACTIVE, PAUSED, CLOSED
    const { user } = useAuth();
    // console.log('CounselingPage User State:', user);
    const router = useRouter();

    useEffect(() => {
        fetchProcesses();
    }, []);

    const fetchProcesses = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003'}/counseling`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setProcesses(data);
            } else {
                toast.error('Error cargando procesos');
            }
        } catch (error) {
            toast.error('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    const filteredProcesses = processes.filter(p => {
        if (filter === 'ALL') return true;
        if (filter === 'ACTIVE') return p.status === 'ACTIVE' || p.status === 'PENDING_ACCEPTANCE';
        return p.status === filter;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'DRAFT': return <Badge variant="outline">Borrador</Badge>;
            case 'PENDING_ACCEPTANCE': return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pendiente Aceptación</Badge>;
            case 'ACTIVE': return <Badge className="bg-green-600">Activo</Badge>;
            case 'PAUSED': return <Badge variant="secondary" className="bg-orange-100 text-orange-800">Pausado</Badge>;
            case 'CLOSED': return <Badge variant="secondary">Finalizado</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    const getTypeLabel = (type: string) => {
        return type === 'FORMAL' ? 'Formal' : 'Informal';
    };

    if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

    return (
        <div className="space-y-6 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Acompañamiento</h1>
                    <p className="text-slate-500 mt-1">Acompañamiento espiritual y cuidado mutuo.</p>
                </div>
                <Link href="/counseling/new">
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Iniciar Acompañamiento
                    </Button>
                </Link>
            </div>

            {/* Filters */}
            <div className="flex gap-2 border-b border-gray-100 pb-1 overflow-x-auto">
                {['ACTIVE', 'PAUSED', 'CLOSED', 'ALL'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${filter === f
                            ? 'border-primary text-primary bg-primary/5'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        {f === 'ACTIVE' ? 'Activos' : f === 'PAUSED' ? 'Pausados' : f === 'CLOSED' ? 'Finalizados' : 'Todos'}
                    </button>
                ))}
            </div>

            {/* List */}
            {filteredProcesses.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <p className="text-gray-500">No se encontraron procesos en esta categoría.</p>
                    {filter === 'ACTIVE' && (
                        <Link href="/counseling/new" className="text-primary hover:underline mt-2 inline-block">
                            Iniciar uno nuevo
                        </Link>
                    )}
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredProcesses.map((process) => {
                        // Find my role (mocking logic if participants not populated fully or need filtering)
                        // Assuming backend returns participants with member and person loaded
                        const myParticipant = process.participants?.find((p: any) => p.member?.person?.id === user?.personId);
                        const isCounselor = myParticipant?.role === 'COUNSELOR';

                        const participantsCount = process.participants?.length || 0;
                        const startDate = process.startDate ? new Date(process.startDate).toLocaleDateString() : 'Sin fecha';

                        return (
                            <Card key={process.id} className={`hover:shadow-md transition-shadow cursor-pointer group border-l-4 ${isCounselor ? 'border-l-blue-500' : 'border-l-pink-500'}`} onClick={() => router.push(`/counseling/${process.id}`)}>
                                <CardContent className="p-6 flex items-center justify-between">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold text-lg text-slate-900">
                                                {process.motive || 'Proceso de Acompañamiento'}
                                            </h3>
                                            {getStatusBadge(process.status)}
                                            <Badge variant="outline" className="text-xs">{getTypeLabel(process.type)}</Badge>
                                            {isCounselor ? (
                                                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none text-xs">Acompañante</Badge>
                                            ) : (
                                                <Badge className="bg-pink-100 text-pink-700 hover:bg-pink-100 border-none text-xs">Acompañado</Badge>
                                            )}
                                        </div>

                                        <div className="flex flex-col gap-1 mt-3">
                                            {/* Show other participants with strict filter */}
                                            {(() => {
                                                const others = process.participants?.filter((p: any) => {
                                                    const pId = p.member?.person?.id;
                                                    const myId = user?.personId;
                                                    // console.log(`Filter: PartID=${pId} vs MyID=${myId}`);
                                                    return pId && myId && pId !== myId;
                                                });

                                                if (!others || others.length === 0) return <div className="text-xs text-gray-400 italic">Sin otros participantes</div>;

                                                return others.map((p: any) => (
                                                    <div key={p.id} className="text-sm font-medium text-slate-700">
                                                        {isCounselor ? 'Acompañando a: ' : 'Acompañado por: '}
                                                        <span className="font-bold">{p.member?.person?.fullName || 'Desconocido'}</span>
                                                    </div>
                                                ));
                                            })()}
                                        </div>

                                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3.5 h-3.5" />
                                                <span>Iniciado: {startDate}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <User className="w-3.5 h-3.5" />
                                                <span>Participantes: {participantsCount}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-gray-300 group-hover:text-primary transition-colors">
                                        <ArrowRight className="w-6 h-6" />
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
