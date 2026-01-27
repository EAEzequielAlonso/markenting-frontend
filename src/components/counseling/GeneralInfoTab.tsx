'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Info, Plus } from 'lucide-react';

interface GeneralInfoTabProps {
    careProcess: any;
    sessions: any[];
    notes: any[];
    isCounselor: boolean;
}

export default function GeneralInfoTab({
    careProcess,
    sessions,
    notes,
    isCounselor
}: GeneralInfoTabProps) {
    if (!careProcess) return null;

    const completedSessions = sessions.filter(s => s.status === 'COMPLETED').length;
    const pendingTasks = sessions.flatMap(s => s.tasks || []).filter(t => t.status !== 'COMPLETED').length;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
            {/* Stats Breakdown */}
            <div className="lg:col-span-2 space-y-4">
                <Card className="border-none shadow-sm bg-white overflow-hidden">
                    <CardHeader className="p-4 bg-slate-50/50 border-b pb-3">
                        <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                            <Info className="w-3.5 h-3.5 text-primary" />
                            Resumen del Proceso
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1">Motivo / Misión Principal</p>
                                    <p className="text-sm text-slate-700 font-medium leading-relaxed">{careProcess.motive}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1">Tipo de Acompañamiento</p>
                                    <Badge variant="outline" className="text-[10px] font-bold py-0.5 bg-slate-50">{careProcess.type || 'ESTÁNDAR'}</Badge>
                                </div>
                            </div>
                            <div className="bg-slate-50/50 p-4 rounded-xl space-y-3">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-slate-500 font-medium">Encuentros finalizados</span>
                                    <span className="font-bold text-slate-700">{completedSessions} de {sessions.length}</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary transition-all duration-1000"
                                        style={{ width: `${sessions.length ? (completedSessions / sessions.length) * 100 : 0}%` }}
                                    />
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-slate-500 font-medium">Misiones pendientes</span>
                                    <Badge variant="outline" className="text-[10px] font-bold bg-amber-50 text-amber-700 border-amber-200">{pendingTasks}</Badge>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-slate-500 font-medium">Notas en bitácora</span>
                                    <span className="font-bold text-emerald-600">
                                        {isCounselor ? notes.length : notes.filter((n: any) => n.visibility === 'SHARED').length}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Participants */}
            <Card className="border-none shadow-sm bg-white overflow-hidden h-fit">
                <CardHeader className="p-4 bg-slate-50/50 border-b pb-3">
                    <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-primary" />
                        Participantes ({careProcess.participants?.length || 0})
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-slate-100">
                        {careProcess.participants?.map((participant: any) => (
                            <div key={participant.id} className="p-4 flex items-center gap-3 hover:bg-slate-50 transition-colors">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0 uppercase">
                                    {participant.member?.person?.fullName?.charAt(0) || 'P'}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-slate-800 truncate">{participant.member?.person?.fullName}</p>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <Badge variant="secondary" className={`text-[8px] py-0 px-1 font-bold group-hover:bg-primary group-hover:text-white transition-all ${participant.role === 'COUNSELOR' ? 'bg-primary/10 text-primary' :
                                                participant.role === 'COUNSELEE' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-amber-100 text-amber-700'
                                            }`}>
                                            {participant.role === 'COUNSELOR' ? 'CONSEJERO' :
                                                participant.role === 'COUNSELEE' ? 'ACONSEJADO' : 'SUPERVISOR'}
                                        </Badge>
                                        {!participant.accepted && (
                                            <Badge variant="outline" className="text-[8px] py-0 px-1 border-amber-200 text-amber-600 bg-amber-50">Pendiente</Badge>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {/* Placeholder for adding more participants if needed in future */}
                        <button className="w-full p-4 flex items-center gap-3 text-slate-400 hover:text-primary hover:bg-slate-50 transition-all group">
                            <div className="w-8 h-8 rounded-full border border-dashed border-slate-300 flex items-center justify-center group-hover:border-primary transition-colors">
                                <Plus className="w-3 h-3" />
                            </div>
                            <span className="text-xs font-bold uppercase tracking-tighter transition-colors">Invitar Colaborador</span>
                        </button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
