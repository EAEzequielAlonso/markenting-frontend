'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, GraduationCap, PauseCircle, PlayCircle, StopCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { DiscipleshipStatus, DiscipleshipRole } from '@/types/discipleship';

interface DiscipleshipHeaderProps {
    discipleship: any;
    onUpdateStatus: (status: DiscipleshipStatus) => void;
    myRole?: DiscipleshipRole;
}

export default function DiscipleshipHeader({ discipleship, onUpdateStatus, myRole }: DiscipleshipHeaderProps) {
    const router = useRouter();

    // Permissions: 
    // DISCIPLE cannot change status (except maybe accept? Backend logic mentions accepted logic but mostly for Counseling. Discipleship is simpler usually).
    // SUPERVISOR or DISCIPLER can change status.
    const canManage = myRole === DiscipleshipRole.SUPERVISOR || myRole === DiscipleshipRole.DISCIPLER;

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => router.push('/discipleship')}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold text-indigo-600 tracking-widest flex items-center gap-1.5">
                            <GraduationCap className="w-3 h-3" />
                            Discipulado
                        </span>
                        <Badge variant={discipleship.status === DiscipleshipStatus.ACTIVE ? 'default' : 'secondary'} className={discipleship.status === DiscipleshipStatus.ACTIVE ? 'bg-green-600' : ''}>
                            {discipleship.status === DiscipleshipStatus.ACTIVE ? 'EN CURSO' : discipleship.status === DiscipleshipStatus.PAUSED ? 'PAUSADO' : 'COMPLETADO'}
                        </Badge>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 mt-1">
                        {discipleship.name || 'Proceso de Discipulado'}
                    </h1>
                    {discipleship.objective && <p className="text-sm text-slate-500 max-w-2xl">{discipleship.objective}</p>}
                </div>
            </div>

            {canManage && (
                <div className="flex gap-2">
                    {discipleship.status === DiscipleshipStatus.ACTIVE && (
                        <>
                            <Button variant="outline" size="sm" onClick={() => onUpdateStatus(DiscipleshipStatus.PAUSED)}>
                                <PauseCircle className="w-4 h-4 mr-2" /> Pausar
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => onUpdateStatus(DiscipleshipStatus.COMPLETED)}>
                                <StopCircle className="w-4 h-4 mr-2" /> Finalizar
                            </Button>
                        </>
                    )}
                    {discipleship.status === DiscipleshipStatus.PAUSED && (
                        <Button variant="outline" size="sm" className="text-green-600 border-green-200 bg-green-50" onClick={() => onUpdateStatus(DiscipleshipStatus.ACTIVE)}>
                            <PlayCircle className="w-4 h-4 mr-2" /> Reanudar
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}
