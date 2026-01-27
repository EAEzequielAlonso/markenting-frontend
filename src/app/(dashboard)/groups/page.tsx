'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, MapPin, Users, Clock, Calendar, BookOpen, Target, Loader2 } from 'lucide-react';
import { SmallGroup } from '@/types/small-group';
import { toast } from 'sonner';
import { CreateGroupDialog } from './create-group-dialog';
import { useRouter } from 'next/navigation';

// ... imports
import { GroupAttendanceDialog } from './group-attendance-dialog';

export default function GroupsPage() {
    const [groups, setGroups] = useState<SmallGroup[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const [selectedGroupForAttendance, setSelectedGroupForAttendance] = useState<SmallGroup | null>(null);

    const fetchGroups = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/small-groups`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Error al cargar grupos');
            const data = await res.json();
            setGroups(data);
        } catch (error) {
            console.error(error);
            toast.error('No se pudieron cargar los grupos');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchGroups();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Grupos Pequeños</h1>
                    <p className="text-slate-500 mt-1 font-medium">Comunidad, crecimiento y vida compartida.</p>
                </div>
                <CreateGroupDialog onGroupCreated={fetchGroups} />
            </div>

            {isLoading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : groups.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <Users className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                    <h3 className="text-lg font-medium text-slate-900">No hay grupos pequeños aún</h3>
                    <p className="text-slate-500">Comienza creando el primero.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groups.map((group) => (
                        <div key={group.id} className="group relative bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                            {/* Decorative Header Gradient */}
                            <div className="h-2 w-full bg-gradient-to-r from-violet-500 via-primary to-indigo-500" />

                            <div className="p-6 space-y-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">
                                            {group.name}
                                        </h3>
                                        <p className="text-sm text-slate-500 line-clamp-1">{group.description || 'Sin descripción'}</p>
                                    </div>
                                    <span className="bg-primary/5 text-primary text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                                        <Users className="w-3 h-3" />
                                        {group.members?.length || 0}
                                    </span>
                                </div>

                                <div className="space-y-2.5">
                                    {group.objective && (
                                        <div className="flex items-start gap-2 text-sm text-slate-600 bg-slate-50 p-2 rounded-lg">
                                            <Target className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                                            <span className="text-xs italic leading-relaxed">"{group.objective}"</span>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-2 text-xs font-medium text-slate-500">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                                            <span>{group.meetingDay || 'A confirmar'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-3.5 h-3.5 text-indigo-500" />
                                            <span>{group.meetingTime ? `${group.meetingTime} hs` : '--:--'}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                        <MapPin className="w-3.5 h-3.5 text-rose-500" />
                                        <span className="truncate">{group.address || 'Ubicación rotativa'}</span>
                                    </div>

                                    {group.currentTopic && (
                                        <div className="flex items-center gap-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                                            <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
                                            <span className="truncate font-medium">Tema: {group.currentTopic}</span>
                                        </div>
                                    )}

                                    {(() => {
                                        const leader = group.members?.find(m => m.role === 'MODERATOR');
                                        if (!leader) return null;
                                        return (
                                            <div className="flex items-center gap-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                                                <Target className="w-3.5 h-3.5 text-violet-500" />
                                                <span className="truncate font-medium">Encargado: {leader.member.person?.firstName} {leader.member.person?.lastName}</span>
                                            </div>
                                        );
                                    })()}
                                </div>
                            </div>

                            <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100">
                                <Button
                                    variant="default"
                                    size="sm"
                                    className="w-full font-semibold shadow-sm"
                                    onClick={() => router.push(`/groups/${group.id}`)}
                                >
                                    Ver Grupo
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedGroupForAttendance && (
                <GroupAttendanceDialog
                    open={!!selectedGroupForAttendance}
                    onOpenChange={(open) => !open && setSelectedGroupForAttendance(null)}
                    group={selectedGroupForAttendance}
                />
            )}
        </div>
    );
}
