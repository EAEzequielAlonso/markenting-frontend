'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserPlus, Search, User, Mail, Phone, Trash2, UserCheck, Plus, Users, Edit2, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Simple Member Search implementation inline for speed/independence
function SimpleMemberSearch({ onSelect, excludeIds = [] }: any) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [searching, setSearching] = useState(false);

    const handleSearch = async (e?: any) => {
        if (e) e.preventDefault();
        setSearching(true);
        try {
            const { data } = await api.get(`/members/search?q=${query || ''}`);
            const filtered = Array.isArray(data) ? data.filter((m: any) => !excludeIds.includes(m.id)) : [];
            setResults(filtered);
        } catch (error) {
            console.error(error);
        } finally {
            setSearching(false);
        }
    }

    // Initial load and filtering
    useEffect(() => {
        const loadInitial = async () => {
            try {
                const { data } = await api.get('/members?limit=100');
                const filtered = Array.isArray(data) ? data.filter((m: any) => !excludeIds.includes(m.id)) : [];
                setResults(filtered.slice(0, 15));
            } catch (e) { console.error(e); }
        };
        loadInitial();
    }, [excludeIds.length, query === '']);

    // Search effect when query changes
    useEffect(() => {
        if (!query) {
            // Re-fetch via loadInitial dependency
        } else {
            const delayDebounceFn = setTimeout(() => {
                handleSearch();
            }, 300);
            return () => clearTimeout(delayDebounceFn);
        }
    }, [query]);

    return (
        <div className="space-y-4">
            <form onSubmit={handleSearch} className="flex gap-2">
                <Input
                    placeholder="Buscar por nombre..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-1"
                />
                <Button type="submit" variant="secondary" disabled={searching}>
                    <Search className="w-4 h-4" />
                </Button>
            </form>
            <div className="max-h-[350px] overflow-y-auto space-y-2 border rounded-md p-2 bg-slate-50/50">
                {results.map((member) => (
                    <div
                        key={member.id}
                        className="flex justify-between items-center p-2 hover:bg-white hover:shadow-sm rounded-md cursor-pointer border border-transparent hover:border-slate-200 transition-all"
                        onClick={() => onSelect(member)}
                    >
                        <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                                <AvatarImage src={member.person?.profileImage} />
                                <AvatarFallback className="bg-slate-200 text-slate-500 font-bold">{member.person?.firstName?.[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm font-bold text-slate-700">{member.person?.fullName}</p>
                                <p className="text-[10px] text-slate-400 font-semibold uppercase">{member.status}</p>
                            </div>
                        </div>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>
                ))}
                {results.length === 0 && !searching && (
                    <div className="text-center py-6 text-slate-400">
                        <Users className="w-8 h-8 mx-auto mb-2 opacity-20" />
                        <p className="text-xs">No hay miembros disponibles</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function ParticipantList({ course, refresh }: any) {
    const [isMemberDialogOpen, setIsMemberDialogOpen] = useState(false);
    const [isGuestDialogOpen, setIsGuestDialogOpen] = useState(false);
    const { register, handleSubmit, reset } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [enrollError, setEnrollError] = useState<string | null>(null);

    const onAddMember = async (member: any) => {
        setEnrollError(null);
        try {
            await api.post(`/courses/${course.id}/participants`, { memberId: member.id });
            toast.success(`${member.person.firstName} inscrito`);
            refresh();
            // User requested to keep modal open for multiple adds
        } catch (error: any) {
            const data = error.response?.data;
            const msg = data?.message || 'Error al inscribir';
            const finalMsg = Array.isArray(msg) ? msg[0] : msg;

            setEnrollError(finalMsg);
        }
    };

    const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean, id: string | null, type: 'MEMBER' | 'GUEST' | null }>({
        open: false, id: null, type: null
    });

    const handleDeleteParticipant = (participantId: string) => {
        setDeleteConfirm({ open: true, id: participantId, type: 'MEMBER' });
    };

    const handleDeleteGuest = (guestId: string) => {
        setDeleteConfirm({ open: true, id: guestId, type: 'GUEST' });
    };

    const confirmDelete = async () => {
        if (!deleteConfirm.id) return;
        try {
            if (deleteConfirm.type === 'MEMBER') {
                await api.delete(`/courses/participants/${deleteConfirm.id}`);
                toast.success('Participante eliminado');
            } else {
                await api.delete(`/courses/guests/${deleteConfirm.id}`);
                toast.success('Invitado eliminado');
            }
            refresh();
        } catch (e) {
            toast.error('Error al eliminar');
        } finally {
            setDeleteConfirm({ open: false, id: null, type: null });
        }
    };

    const [editingGuest, setEditingGuest] = useState<any>(null);

    const onAddGuest = async (data: any) => {
        setIsLoading(true);
        try {
            const fullName = `${data.firstName} ${data.lastName}`.trim();
            const payload = {
                ...data,
                fullName,
                email: data.email || undefined,
                phone: data.phone || undefined,
                notes: data.notes || undefined
            };

            if (editingGuest) {
                await api.patch(`/courses/guests/${editingGuest.id}`, payload);
                toast.success('Invitado actualizado');
            } else {
                await api.post(`/courses/${course.id}/guests`, payload);
                toast.success('Invitado registrado');
            }

            setIsGuestDialogOpen(false);
            setEditingGuest(null);
            reset();
            refresh();
        } catch (error: any) {
            const data = error.response?.data;
            let finalMsg = 'Error al procesar invitado';

            if (data?.message) {
                finalMsg = Array.isArray(data.message) ? data.message[0] : data.message;
            }

            setEnrollError(finalMsg);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditGuest = (guest: any) => {
        // Assume guest has fullName which we split for the form
        const names = guest.fullName.split(' ');
        setEditingGuest(guest);
        reset({
            firstName: names[0],
            lastName: names.slice(1).join(' '),
            email: guest.email,
            phone: guest.phone,
            notes: guest.notes
        });
        setIsGuestDialogOpen(true);
    };

    const onGenerateInvite = () => {
        const startDate = new Date(course.startDate + 'T12:00:00');
        const text = `¡Hola! Te invito ${course.type === 'ACTIVITY' ? 'a la actividad' : 'al curso'} "${course.title}". Inicia el ${startDate.toLocaleDateString()}. ¿Te gustaría participar?`;
        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    }

    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        api.get(`/courses/${course.id}/stats`).then(res => setStats(res.data)).catch(console.error);
    }, [course.id]);

    const isActivity = course.type === 'ACTIVITY';

    return (
        <div className="space-y-6">
            <div className={`bg-gradient-to-r p-4 rounded-xl border flex justify-between items-center ${isActivity ? 'from-emerald-50 to-teal-50 border-emerald-100' : 'from-indigo-50 to-blue-50 border-indigo-100'}`}>
                <div>
                    <h4 className={`font-bold ${isActivity ? 'text-emerald-900' : 'text-indigo-900'}`}>Invitar Participantes</h4>
                    <p className={`text-xs ${isActivity ? 'text-emerald-600' : 'text-indigo-600'}`}>Comparte {isActivity ? 'esta actividad' : 'este curso'} con miembros o amigos.</p>
                </div>
                <div className="flex gap-2">
                    {stats && (
                        <div className={`bg-white px-3 py-1 rounded border text-xs font-bold flex flex-col items-center justify-center ${isActivity ? 'border-emerald-100 text-emerald-800' : 'border-indigo-100 text-indigo-800'}`}>
                            <span>Asistencia Prom.</span>
                            <span className="text-lg">{stats.averageAttendance}</span>
                        </div>
                    )}
                    <Button size="sm" onClick={onGenerateInvite} className={`bg-white border hover:bg-white shadow-sm h-auto ${isActivity ? 'text-emerald-600 border-emerald-200' : 'text-indigo-600 border-indigo-200'}`}>
                        Copiar Invitación
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="members" className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="members" className="flex items-center gap-2"><UserCheck className="w-4 h-4" /> Miembros ({course.participants?.length || 0})</TabsTrigger>
                    <TabsTrigger value="guests" className="flex items-center gap-2"><User className="w-4 h-4" /> Invitados ({course.guests?.length || 0})</TabsTrigger>
                </TabsList>

                <TabsContent value="members" className="space-y-4">
                    <Button onClick={() => setIsMemberDialogOpen(true)} className="w-full border-dashed border-2 border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100 mb-4 h-12">
                        <Plus className="w-5 h-5 mr-2" /> {isActivity ? 'Inscribir Miembro' : 'Inscribir Miembro'}
                    </Button>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {course.participants?.map((p: any) => (
                            <div key={p.id} className="flex items-center p-3 bg-white border border-slate-100 rounded-lg shadow-sm group relative">
                                <Avatar className="h-10 w-10 border-2 border-white shadow-sm mr-3">
                                    <AvatarImage src={p.member.person?.profileImage} />
                                    <AvatarFallback className="bg-indigo-100 text-indigo-700 font-bold">{p.member.person?.firstName?.[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-bold text-slate-800 text-sm">{p.member.person?.fullName}</p>
                                    <p className="text-xs text-slate-500">{p.role}</p>
                                </div>
                                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-500 hover:bg-red-50 p-2 h-auto"
                                        onClick={() => handleDeleteParticipant(p.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="guests" className="space-y-4">
                    <Button onClick={() => setIsGuestDialogOpen(true)} className="w-full border-dashed border-2 border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100 mb-4 h-12">
                        <Plus className="w-5 h-5 mr-2" /> Registrar Nuevo Invitado
                    </Button>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {course.guests?.map((g: any) => (
                            <div key={g.id} className="p-3 bg-white border border-orange-100 rounded-lg shadow-sm relative group">
                                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                                        onClick={() => handleEditGuest(g)}
                                    >
                                        <Edit2 className="w-3.5 h-3.5" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                        onClick={() => handleDeleteGuest(g.id)}
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </Button>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                                        {g.fullName?.[0]}
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="font-bold text-slate-800 text-sm truncate">{g.fullName}</p>
                                        <div className="flex flex-col gap-0.5 mt-1">
                                            {g.phone && <span className="text-[10px] text-slate-500 flex items-center gap-1"><Phone className="w-3 h-3" /> {g.phone}</span>}
                                            {g.email && <span className="text-[10px] text-slate-500 flex items-center gap-1"><Mail className="w-3 h-3" /> {g.email}</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>

            {/* MEMBER DIALOG */}
            <Dialog open={isMemberDialogOpen} onOpenChange={(open) => {
                setIsMemberDialogOpen(open);
                setEnrollError(null);
            }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Inscribir Miembro</DialogTitle>
                        <DialogDescription>Busca y selecciona un miembro activo.</DialogDescription>
                    </DialogHeader>
                    {enrollError && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-md text-sm font-bold animate-pulse mb-4">
                            ⚠️ {enrollError}
                        </div>
                    )}
                    <SimpleMemberSearch
                        onSelect={onAddMember}
                        excludeIds={(course.participants || []).map((p: any) => p.member.id)}
                    />
                </DialogContent>
            </Dialog>

            {/* GUEST DIALOG */}
            <Dialog open={isGuestDialogOpen} onOpenChange={(open) => {
                setIsGuestDialogOpen(open);
                setEnrollError(null);
                if (!open) setEditingGuest(null);
            }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingGuest ? 'Editar Invitado' : 'Registrar Invitado'}</DialogTitle>
                        <DialogDescription>Datos de contacto para seguimiento.</DialogDescription>
                    </DialogHeader>
                    {enrollError && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-md text-sm font-bold animate-pulse mb-2">
                            ⚠️ {enrollError}
                        </div>
                    )}
                    <form onSubmit={handleSubmit(onAddGuest, (errors) => console.log(errors))} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Nombre</Label>
                                <Input {...register('firstName', { required: true })} placeholder="Ej: Juan" />
                            </div>
                            <div className="space-y-2">
                                <Label>Apellido</Label>
                                <Input {...register('lastName', { required: true })} placeholder="Ej: Pérez" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Teléfono</Label>
                                <Input {...register('phone')} placeholder="+54..." />
                            </div>
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input {...register('email')} placeholder="juan@gmail.com" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Notas</Label>
                            <Input {...register('notes')} placeholder="Referido por..." />
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={isLoading}>
                                {editingGuest ? 'Guardar Cambios' : 'Registrar'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* CONFIRM DELETE DIALOG */}
            <Dialog open={deleteConfirm.open} onOpenChange={(open) => setDeleteConfirm(prev => ({ ...prev, open }))}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>¿Estás seguro?</DialogTitle>
                        <DialogDescription>
                            Esta acción eliminará al {deleteConfirm.type === 'MEMBER' ? 'miembro' : 'invitado'} del curso y de todos los eventos de agenda asociados.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteConfirm({ open: false, id: null, type: null })}>Cancelar</Button>
                        <Button variant="destructive" onClick={confirmDelete}>Eliminar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
