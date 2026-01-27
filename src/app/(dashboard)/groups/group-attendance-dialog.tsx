'use client';

import { useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { SmallGroup } from '@/types/small-group';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface GroupAttendanceDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    group: SmallGroup;
}

export function GroupAttendanceDialog({ open, onOpenChange, group }: GroupAttendanceDialogProps) {
    const [searchTerm, setSearchTerm] = useState('');

    const stats = useMemo(() => {
        if (!group.members || !group.events) return { totalEvents: 0, members: [] };

        const pastEvents = group.events.filter(e => new Date(e.startDate) < new Date());
        const totalEvents = pastEvents.length;

        const memberStats = group.members.map(member => {
            const personId = member.member.person?.id;

            const attendedCount = personId
                ? pastEvents.filter(ev => (ev.attendees || []).some((att: any) => att.id === personId)).length
                : 0;

            const percentage = totalEvents > 0 ? (attendedCount / totalEvents) * 100 : 0;

            return {
                member,
                attendedCount,
                percentage
            };
        });

        // Sorting: Most attended first
        memberStats.sort((a, b) => b.attendedCount - a.attendedCount);

        return { totalEvents, members: memberStats };
    }, [group]);

    const filteredStats = stats.members.filter(s =>
        s.member.member.person?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.member.member.person?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle>Reporte de Asistencia</DialogTitle>
                    <DialogDescription>
                        Resumen de participación del grupo.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-6 flex-1 overflow-hidden flex flex-col">

                    {/* Top Summary Card */}
                    <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 flex items-center justify-between shadow-sm">
                        <div>
                            <h4 className="text-sm font-semibold text-slate-900">Total de Reuniones</h4>
                            <p className="text-xs text-slate-500">Eventos realizados hasta la fecha</p>
                        </div>
                        <div className="text-3xl font-bold text-primary flex items-end leading-none">
                            {stats.totalEvents}
                            <span className="text-sm text-slate-400 font-medium ml-1 mb-1">reuniones</span>
                        </div>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="Buscar miembro..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9"
                        />
                    </div>

                    <div className="border rounded-md overflow-hidden flex-1 relative bg-slate-50/50">
                        <div className="absolute inset-0 overflow-y-auto p-2 space-y-2">
                            {filteredStats.length === 0 ? (
                                <div className="text-center py-10 text-slate-500 text-sm">
                                    No hay datos para mostrar
                                </div>
                            ) : (
                                filteredStats.map((stat, idx) => (
                                    <div key={idx} className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm flex flex-col gap-2">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                                                    {(stat.member.member.person?.firstName || '?').charAt(0)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold text-slate-900">
                                                        {stat.member.member.person?.firstName} {stat.member.member.person?.lastName}
                                                    </span>
                                                    <span className="text-xs text-slate-500 capitalize">
                                                        {stat.member.role === 'MODERATOR' ? 'Líder' : 'Participante'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-sm font-bold text-slate-700">
                                                {stat.attendedCount} <span className="text-xs font-normal text-slate-400">asistencias</span>
                                            </div>
                                        </div>

                                        {/* Progress Bar Container */}
                                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-500 ${stat.percentage >= 80 ? 'bg-emerald-500' :
                                                        stat.percentage >= 50 ? 'bg-amber-500' :
                                                            'bg-rose-500'
                                                    }`}
                                                style={{ width: `${stat.percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={() => onOpenChange(false)}>Cerrar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
