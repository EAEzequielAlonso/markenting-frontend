'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MessageSquare, CheckCircle, Plus } from 'lucide-react';

interface StatsOverviewProps {
    careProcess: any;
    sessionsCount: number;
    notesCount: number;
    tasksCount: number;
    daysActive: number;
}

export default function StatsOverview({
    careProcess,
    sessionsCount,
    notesCount,
    tasksCount,
    daysActive
}: StatsOverviewProps) {
    if (!careProcess) return null;

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <Card className="bg-white/50 border-none shadow-sm overflow-hidden group hover:shadow-md transition-all duration-300">
                <CardContent className="p-3 relative overflow-hidden">
                    <div className="absolute -right-2 -bottom-2 opacity-[0.03] group-hover:scale-110 transition-transform duration-500">
                        <Calendar className="w-16 h-16 text-primary" />
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Encuentros</p>
                    <p className="text-2xl font-bold text-slate-800">{sessionsCount}</p>
                </CardContent>
            </Card>

            <Card className="bg-white/50 border-none shadow-sm overflow-hidden group hover:shadow-md transition-all duration-300">
                <CardContent className="p-3 relative overflow-hidden">
                    <div className="absolute -right-2 -bottom-2 opacity-[0.03] group-hover:scale-110 transition-transform duration-500">
                        <MessageSquare className="w-16 h-16 text-emerald-600" />
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Notas</p>
                    <p className="text-2xl font-bold text-emerald-600">{notesCount}</p>
                </CardContent>
            </Card>

            <Card className="bg-white/50 border-none shadow-sm overflow-hidden group hover:shadow-md transition-all duration-300">
                <CardContent className="p-3 relative overflow-hidden">
                    <div className="absolute -right-2 -bottom-2 opacity-[0.03] group-hover:scale-110 transition-transform duration-500">
                        <CheckCircle className="w-16 h-16 text-amber-600" />
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tareas</p>
                    <p className="text-2xl font-bold text-amber-600">{tasksCount}</p>
                </CardContent>
            </Card>

            <Card className="bg-white/50 border-none shadow-sm overflow-hidden group hover:shadow-md transition-all duration-300">
                <CardContent className="p-3 relative overflow-hidden">
                    <div className="absolute -right-2 -bottom-2 opacity-[0.03] group-hover:scale-110 transition-transform duration-500">
                        <Plus className="w-16 h-16 text-indigo-600" />
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Edad Proceso</p>
                    <p className="text-2xl font-bold text-indigo-600">{daysActive} <span className="text-[10px] font-bold text-slate-400">DÍAS</span></p>
                </CardContent>
            </Card>
        </div>
    );
}
