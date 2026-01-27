'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Pencil, Save, X, PauseCircle, StopCircle, PlayCircle, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ProcessHeaderProps {
    careProcess: any;
    isCounselor: boolean;
    isEditingTitle: boolean;
    setIsEditingTitle: (val: boolean) => void;
    editedTitle: string;
    setEditedTitle: (val: string) => void;
    handleUpdateTitle: () => void;
    handleUpdateStatus: (status: string) => void;
    isCounselee: boolean;
    myParticipant: any;
}

export default function ProcessHeader({
    careProcess,
    isCounselor,
    isEditingTitle,
    setIsEditingTitle,
    editedTitle,
    setEditedTitle,
    handleUpdateTitle,
    handleUpdateStatus,
    isCounselee,
    myParticipant
}: ProcessHeaderProps) {
    const router = useRouter();

    if (!careProcess) return null;

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
                <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0 hover:bg-slate-100 transition-colors" onClick={() => router.push('/counseling')}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="flex-1 min-w-0">
                    {isEditingTitle ? (
                        <div className="flex items-center gap-2 max-w-2xl bg-white/80 p-1 rounded-lg border border-primary/20 shadow-md animate-in zoom-in-95 duration-200">
                            <Input
                                value={editedTitle}
                                onChange={(e) => setEditedTitle(e.target.value)}
                                className="h-9 text-lg font-bold bg-white border-primary/20 focus:ring-primary/30"
                                placeholder="Motivo del acompañamiento"
                                autoFocus
                            />
                            <Button size="sm" className="h-9 px-4 bg-emerald-600 hover:bg-emerald-700 font-bold shadow-md shadow-emerald-200/50" onClick={handleUpdateTitle}>
                                <Save className="w-4 h-4 mr-1.5" />
                                Guardar
                            </Button>
                            <Button size="sm" variant="ghost" className="h-9 px-3 text-slate-400 hover:text-red-500 transition-colors" onClick={() => setIsEditingTitle(false)}>
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-[10px] uppercase font-bold text-primary tracking-widest flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                    Acompañamiento Espiritual
                                </span>
                                <div className="h-px w-8 bg-gradient-to-r from-primary/30 to-transparent" />
                            </div>
                            <h1 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-600 bg-clip-text text-transparent flex items-center gap-3 tracking-tight leading-none truncate py-1">
                                {careProcess.motive}
                                {isCounselor && (
                                    <button
                                        onClick={() => { setEditedTitle(careProcess.motive); setIsEditingTitle(true); }}
                                        className="p-1.5 rounded-full hover:bg-primary/10 text-slate-300 hover:text-primary transition-all shadow-sm hover:shadow-md"
                                        title="Editar motivo del acompañamiento"
                                    >
                                        <Pencil className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </h1>
                            <div className="flex items-center gap-3 mt-2 flex-wrap">
                                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-100/50 rounded-full border border-slate-200 shadow-sm backdrop-blur-sm">
                                    <Users className="w-3 h-3 text-slate-400" />
                                    <span className="text-[10px] text-slate-600 font-bold uppercase tracking-tight">
                                        {careProcess.participants?.find((p: any) => p.role === 'COUNSELEE')?.member?.person?.fullName || 'Acompañado'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-[10px] uppercase font-bold text-slate-500 bg-white/50 border-slate-200 shadow-sm">
                                        PROCESO {careProcess.type}
                                    </Badge>
                                    <Badge
                                        variant={careProcess.status === 'ACTIVE' ? 'default' : 'secondary'}
                                        className={`text-[10px] font-bold shadow-sm ${careProcess.status === 'ACTIVE' ? 'bg-primary border-primary/20 shadow-primary/20' :
                                                careProcess.status === 'PAUSED' ? 'bg-amber-100 text-amber-700 border-amber-200 shadow-amber-100/50' :
                                                    careProcess.status === 'PENDING_ACCEPTANCE' ? 'bg-blue-100 text-blue-700 border-blue-200 shadow-blue-100/50' : ''
                                            }`}
                                    >
                                        {careProcess.status === 'ACTIVE' ? 'ACTIVO' :
                                            careProcess.status === 'PAUSED' ? 'EN PAUSA' :
                                                careProcess.status === 'CLOSED' || careProcess.status === 'FINISHED' ? 'FINALIZADO' :
                                                    careProcess.status === 'PENDING_ACCEPTANCE' ? 'PENDIENTE DE ACEPTACIÓN' : 'PENDIENTE'}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-start md:self-center pt-2 md:pt-0">
                {isCounselee && (!myParticipant?.accepted || careProcess.status === 'PENDING_ACCEPTANCE') && (
                    <Button
                        className="h-10 px-6 bg-primary hover:bg-primary/90 font-bold shadow-lg shadow-primary/30 animate-bounce"
                        onClick={() => handleUpdateStatus('ACTIVE')}
                    >
                        <PlayCircle className="w-5 h-5 mr-2" />
                        Aceptar Acompañamiento
                    </Button>
                )}

                {isCounselor && (
                    <div className="flex gap-2 p-1 bg-slate-100/50 rounded-lg border border-slate-200 shadow-inner backdrop-blur-sm">
                        {careProcess.status === 'ACTIVE' ? (
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 border-amber-200 text-amber-700 hover:bg-amber-50 font-bold shadow-sm"
                                onClick={() => handleUpdateStatus('PAUSED')}
                            >
                                <PauseCircle className="w-4 h-4 mr-2" />
                                Pausar
                            </Button>
                        ) : careProcess.status === 'PAUSED' ? (
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 border-primary/20 text-primary hover:bg-primary/5 font-bold shadow-sm"
                                onClick={() => handleUpdateStatus('ACTIVE')}
                            >
                                <PlayCircle className="w-4 h-4 mr-2" />
                                Reanudar
                            </Button>
                        ) : null}

                        {(careProcess.status === 'ACTIVE' || careProcess.status === 'PAUSED' || careProcess.status === 'PENDING_ACCEPTANCE') && (
                            <Button
                                variant="destructive"
                                size="sm"
                                className="h-8 bg-red-600 hover:bg-red-700 font-bold shadow-sm"
                                onClick={() => handleUpdateStatus('CLOSED')}
                            >
                                <StopCircle className="w-4 h-4 mr-2" />
                                Finalizar
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
