'use client';

import { useState, useEffect, use } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Users,
    Calendar as CalendarIcon,
    CheckSquare,
    FileText,
    Settings,
    ChevronLeft,
    Plus,
    UserPlus,
    Clock,
    MapPin,
    ArrowRight,
    MessageSquare,
    ClipboardList,
    ShieldCheck,
    Mail,
    Phone,
    ChevronRight,
    CheckCircle2,
    AlertCircle,
    Settings2,
    Trash2
} from "lucide-react";
import { toast } from 'sonner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { MinistryRole } from '@/types/auth-types';
import { Ministry, MinistryMember, MinistryTask } from '@/types/ministry';

import { AddMemberDialog } from '../add-member-dialog';
import { EditMinistryDialog } from '../edit-ministry-dialog';
import { CreateTaskDialog } from '../create-task-dialog';
import { CreateNoteDialog } from '../create-note-dialog';
import { CreateEventDialog } from '../../agenda/create-event-dialog';
import { CalendarEventType } from '@/types/agenda';
import { EditMemberRoleDialog } from '../edit-member-role-dialog';
import { Pencil } from 'lucide-react';

export default function MinistryDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [ministry, setMinistry] = useState<Ministry | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('members');
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
    const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
    const [isCreateNoteOpen, setIsCreateNoteOpen] = useState(false);

    // New state for role editing
    const [memberToEdit, setMemberToEdit] = useState<MinistryMember | null>(null);
    const [isEditRoleOpen, setIsEditRoleOpen] = useState(false);

    useEffect(() => {
        fetchMinistry();
    }, [id]);

    const fetchMinistry = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ministries/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Error al cargar ministerio');
            const data = await res.json();
            setMinistry(data);
        } catch (error) {
            console.error(error);
            toast.error('No se pudo cargar el ministerio');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveMember = async (memberMinistryId: string) => {
        if (!confirm('¿Estás seguro de quitar a este miembro del ministerio?')) return;
        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ministries/${id}/members/${memberMinistryId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!res.ok) throw new Error('Error al eliminar miembro');
            toast.success('Miembro eliminado');
            fetchMinistry();
        } catch (error) {
            console.error(error);
            toast.error('No se pudo eliminar al miembro');
        }
    };

    const handleToggleTask = async (taskId: string, currentStatus: string) => {
        const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
        // Optimistic update
        if (!ministry) return;
        const updatedTasks = ministry.tasks.map(t =>
            t.id === taskId ? { ...t, status: newStatus as any } : t
        );
        setMinistry({ ...ministry, tasks: updatedTasks });

        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ministries/${id}/tasks/${taskId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (!res.ok) throw new Error('Error al actualizar tarea');
        } catch (error) {
            console.error(error);
            toast.error('Error al actualizar estado de la misión');
            fetchMinistry(); // Revert on error
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!ministry) return null;

    const eventsWithNotes = ministry.calendarEvents?.filter((e: any) => e.meetingNote) || [];

    return (
        <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-0">
            {/* Dialogs */}
            <EditMinistryDialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                ministry={ministry}
                onSuccess={fetchMinistry}
            />
            <AddMemberDialog
                open={isAddMemberOpen}
                onOpenChange={setIsAddMemberOpen}
                ministryId={ministry.id}
                onSuccess={fetchMinistry}
            />
            <CreateTaskDialog
                open={isCreateTaskOpen}
                onOpenChange={setIsCreateTaskOpen}
                ministryId={ministry.id}
                onSuccess={fetchMinistry}
            />
            <CreateNoteDialog
                open={isCreateNoteOpen}
                onOpenChange={setIsCreateNoteOpen}
                ministryId={ministry.id}
                onSuccess={fetchMinistry}
            />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-slate-500 font-bold">
                        <span className="cursor-pointer hover:text-primary transition-colors" onClick={() => router.push('/ministries')}>Ministerios</span>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-slate-900">{ministry.name}</span>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight">{ministry.name}</h1>
                            <Badge className="font-bold gap-1" style={{ backgroundColor: ministry.status === 'active' ? '#dcfce7' : '#f1f5f9', color: ministry.status === 'active' ? '#166534' : '#64748b' }}>
                                {ministry.status === 'active' ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                                {ministry.status === 'active' ? 'ACTIVO' : 'INACTIVO'}
                            </Badge>
                        </div>
                        <p className="text-slate-500 font-medium max-w-2xl">{ministry.description || 'Sin descripción.'}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="default"
                        size="sm"
                        className="font-bold gap-2 text-white bg-indigo-600 hover:bg-indigo-700"
                        onClick={() => router.push(`/ministries/${id}/schedule`)}
                    >
                        <CalendarIcon className="w-4 h-4" />
                        Cronograma
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="font-bold gap-2 text-slate-600"
                        onClick={() => setIsEditDialogOpen(true)}
                    >
                        <Settings2 className="w-4 h-4" />
                        Configurar
                    </Button>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-4 gap-6">

                {/* Sidebar Info */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-slate-200/50 overflow-hidden">
                        <div className="h-2 w-full" style={{ backgroundColor: ministry.color }}></div>
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg font-bold">Información General</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Descripción</p>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        {ministry.description || 'Sin descripción.'}
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Líder Principal</p>
                                    {ministry.leader ? (
                                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-slate-200 overflow-hidden shrink-0">
                                                {ministry.leader.person.avatarUrl ? (
                                                    <img src={ministry.leader.person.avatarUrl} alt="" className="w-full h-full object-cover" />
                                                ) : <ShieldCheck className="w-5 h-5 text-indigo-500" />}
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="text-sm font-bold text-slate-800 truncate">
                                                    {ministry.leader.person.firstName} {ministry.leader.person.lastName}
                                                </p>
                                                <div className="flex items-center gap-2 opacity-60">
                                                    <Mail className="w-3 h-3" />
                                                    <p className="text-[10px] truncate">{ministry.leader.person.email}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-slate-400 italic">No asignado</p>
                                    )}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 flex justify-between">
                                <div className="text-center px-4">
                                    <p className="text-xl font-black text-slate-900">{ministry.members?.length || 0}</p>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase">Miembros</p>
                                </div>
                                <div className="w-px h-8 bg-slate-100"></div>
                                <div className="text-center px-4">
                                    <p className="text-xl font-black text-slate-900">{ministry.tasks?.filter(t => t.status === 'pending').length || 0}</p>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase">Misiones</p>
                                </div>
                                <div className="w-px h-8 bg-slate-100"></div>
                                <div className="text-center px-4">
                                    <p className="text-xl font-black text-slate-900">{ministry.calendarEvents?.length || 0}</p>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase">Eventos</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Button className="w-full h-12 rounded-2xl font-bold gap-2 bg-slate-900 hover:bg-slate-800" onClick={() => setIsAddMemberOpen(true)}>
                        <UserPlus className="w-5 h-5" />
                        Añadir Integrante
                    </Button>
                </div>

                {/* Main Content Tabs */}
                <div className="lg:col-span-3">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                        <TabsList className="bg-slate-100/50 p-1.5 rounded-2xl h-14 border border-slate-200/60 w-full lg:w-max grid grid-cols-4 lg:flex lg:gap-2">
                            <TabsTrigger value="members" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-primary font-bold text-xs gap-2">
                                <Users className="w-4 h-4 hidden sm:block" />
                                Integrantes
                            </TabsTrigger>
                            <TabsTrigger value="calendar" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-primary font-bold text-xs gap-2">
                                <CalendarIcon className="w-4 h-4 hidden sm:block" />
                                Calendario
                            </TabsTrigger>
                            <TabsTrigger value="tasks" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-primary font-bold text-xs gap-2">
                                <CheckSquare className="w-4 h-4 hidden sm:block" />
                                Misiones
                            </TabsTrigger>
                            <TabsTrigger value="notes" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-primary font-bold text-xs gap-2">
                                <FileText className="w-4 h-4 hidden sm:block" />
                                Notas
                            </TabsTrigger>
                            <TabsTrigger value="config" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-primary font-bold text-xs gap-2">
                                <Settings className="w-4 h-4 hidden sm:block" />
                                Roles en Culto
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="members" className="space-y-4 outline-none">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-lg font-bold text-slate-800">Lista de Equipo</h3>
                                <Badge variant="secondary" className="font-bold text-[10px]">{ministry.members?.length || 0} PERSONAS</Badge>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                {ministry.members?.map((member) => (
                                    <Card key={member.id} className="group hover:ring-2 hover:ring-primary/20 transition-all border-none bg-white shadow-sm ring-1 ring-slate-200/50 rounded-2xl overflow-hidden">
                                        <CardContent className="p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-slate-50 overflow-hidden border border-slate-100">
                                                    {member.member.person.avatarUrl ? (
                                                        <img src={member.member.person.avatarUrl} alt="" className="w-full h-full object-cover" />
                                                    ) : <Users className="w-6 h-6 m-3 text-slate-300" />}
                                                </div>
                                                <div className="space-y-0.5">
                                                    <p className="font-black text-slate-900 leading-tight">
                                                        {member.member.person.firstName} {member.member.person.lastName}
                                                    </p>
                                                    <Badge className="text-[9px] h-4 leading-none font-black bg-indigo-50 text-indigo-500 border-none capitalize">
                                                        {
                                                            {
                                                                [MinistryRole.LEADER]: 'Líder',
                                                                [MinistryRole.COORDINATOR]: 'Coordinador',
                                                                [MinistryRole.TEAM_MEMBER]: 'Miembro del Equipo'
                                                            }[member.roleInMinistry] || member.roleInMinistry
                                                        }
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-slate-400 rounded-full hover:text-indigo-500 hover:bg-indigo-50"
                                                    onClick={() => {
                                                        setMemberToEdit(member);
                                                        setIsEditRoleOpen(true);
                                                    }}
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-slate-400 rounded-full hover:text-red-500 hover:bg-red-50"
                                                    onClick={() => handleRemoveMember(member.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                            <EditMemberRoleDialog
                                open={isEditRoleOpen}
                                onOpenChange={(open) => {
                                    setIsEditRoleOpen(open);
                                    if (!open) setMemberToEdit(null);
                                }}
                                ministryId={ministry.id}
                                member={memberToEdit}
                                onSuccess={fetchMinistry}
                            />
                        </TabsContent>

                        <TabsContent value="calendar" className="space-y-4 outline-none">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-lg font-bold text-slate-800">Próximos Eventos</h3>
                                <CreateEventDialog
                                    onEventCreated={fetchMinistry}
                                    defaultType={CalendarEventType.MINISTRY}
                                    defaultEntityId={ministry.id}
                                    trigger={
                                        <Button size="sm" className="font-bold gap-2 rounded-xl h-10 px-4">
                                            <Plus className="w-4 h-4" />
                                            Agendar Evento
                                        </Button>
                                    }
                                />
                            </div>

                            <div className="grid gap-3">
                                {ministry.calendarEvents?.length === 0 ? (
                                    <div className="py-16 text-center bg-slate-50/30 rounded-3xl border-2 border-dashed border-slate-200/50">
                                        <CalendarIcon className="w-12 h-12 mx-auto text-slate-200 mb-2" />
                                        <p className="text-sm font-bold text-slate-400">Sin eventos programados</p>
                                        <p className="text-[10px] uppercase text-slate-400 tracking-widest font-bold">Usa el botón para agendar reuniones</p>
                                    </div>
                                ) : (
                                    ministry.calendarEvents?.sort((a: any, b: any) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()).map((event: any) => (
                                        <div key={event.id} className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                                            <div className="flex-shrink-0 w-14 text-center bg-indigo-50 rounded-xl py-2 text-indigo-600">
                                                <p className="text-xs font-bold uppercase">{format(new Date(event.startDate), 'MMM', { locale: es })}</p>
                                                <p className="text-xl font-black leading-none">{format(new Date(event.startDate), 'd')}</p>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-slate-900">{event.title}</h4>
                                                <div className="flex items-center gap-4 mt-1 text-xs text-slate-500 font-medium">
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {format(new Date(event.startDate), 'HH:mm')} - {format(new Date(event.endDate), 'HH:mm')}
                                                    </span>
                                                    {event.location && (
                                                        <span className="flex items-center gap-1">
                                                            <MapPin className="w-3 h-3" />
                                                            {event.location}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="tasks" className="mt-6 space-y-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">Misiones y Tareas</h3>
                                    <p className="text-sm text-slate-500 font-medium">Gestiona las responsabilidades del equipo.</p>
                                </div>
                                <Button className="font-bold gap-2 shadow-lg shadow-primary/20" onClick={() => setIsCreateTaskOpen(true)}>
                                    <CheckCircle2 className="w-5 h-5" />
                                    Nueva Misión
                                </Button>
                            </div>

                            <div className="space-y-3">
                                {ministry.tasks?.map((task) => (
                                    <div key={task.id} className={`flex items-start gap-4 p-4 rounded-2xl border transition-all ${task.status === 'completed' ? 'bg-slate-50 border-slate-100 opacity-75' : 'bg-white border-slate-200 shadow-sm'}`}>
                                        <button
                                            onClick={() => handleToggleTask(task.id, task.status)}
                                            className={`mt-1 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all ${task.status === 'completed' ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300 hover:border-primary'}`}
                                        >
                                            {task.status === 'completed' && <CheckCircle2 className="w-4 h-4" />}
                                        </button>
                                        <div className="flex-1 space-y-1">
                                            <p className={`font-bold text-slate-900 ${task.status === 'completed' ? 'line-through text-slate-500' : ''}`}>
                                                {task.title}
                                            </p>
                                            <div className="flex items-center gap-3">
                                                {task.assignedTo && (
                                                    <div className="flex items-center gap-1 text-[10px] font-bold text-indigo-500">
                                                        <Users className="w-3 h-3" />
                                                        {task.assignedTo.person.firstName}
                                                    </div>
                                                )}
                                                {task.dueDate && (
                                                    <div className="flex items-center gap-1 text-[10px] font-bold text-amber-500">
                                                        <Clock className="w-3 h-3" />
                                                        {format(new Date(task.dueDate), "d 'de' MMM", { locale: es })}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {(!ministry.tasks || ministry.tasks.length === 0) && (
                                    <div className="py-20 text-center bg-slate-50/30 rounded-3xl border-2 border-dashed border-slate-200/50">
                                        <ClipboardList className="w-12 h-12 mx-auto text-slate-200 mb-2" />
                                        <p className="text-sm font-bold text-slate-400">Todo el día al día</p>
                                        <p className="text-[10px] uppercase text-slate-400 tracking-widest font-bold">No hay misiones pendientes</p>
                                    </div>
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="notes" className="space-y-4 outline-none">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold text-slate-800">Bitácora de Reuniones</h3>
                                <Button className="font-bold gap-2 shadow-lg" onClick={() => setIsCreateNoteOpen(true)}>
                                    <FileText className="w-4 h-4" />
                                    Nueva Bitácora
                                </Button>
                            </div>

                            <div className="space-y-4">
                                {eventsWithNotes.length === 0 ? (
                                    <div className="py-16 text-center bg-slate-50/30 rounded-3xl border-2 border-dashed border-slate-200/50">
                                        <FileText className="w-12 h-12 mx-auto text-slate-200 mb-2" />
                                        <p className="text-sm font-bold text-slate-400">Sin notas registradas</p>
                                        <p className="text-[10px] uppercase text-slate-400 tracking-widest font-bold">Asocia notas a tus eventos del calendario</p>
                                    </div>
                                ) : (
                                    eventsWithNotes.map((event: any) => (
                                        <Card key={event.id} className="border-none shadow-sm ring-1 ring-slate-200/50 rounded-2xl overflow-hidden hover:bg-slate-50/50 transition-all">
                                            <CardHeader className="pb-2 bg-slate-50/50 border-b border-slate-100">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <CardTitle className="text-base font-bold text-slate-900">{event.title}</CardTitle>
                                                        <CardDescription className="font-medium text-xs">
                                                            {format(new Date(event.startDate), "PPPP", { locale: es })}
                                                        </CardDescription>
                                                    </div>
                                                    <Badge variant="outline" className="bg-white">
                                                        {event.meetingNote?.createdBy?.firstName || 'Autor desconocido'}
                                                    </Badge>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="pt-4 space-y-4 text-sm">
                                                {event.meetingNote.summary && (
                                                    <div>
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Resumen</p>
                                                        <p className="text-slate-700">{event.meetingNote.summary}</p>
                                                    </div>
                                                )}
                                                {event.meetingNote.decisions && (
                                                    <div>
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Acuerdos</p>
                                                        <p className="text-slate-700 bg-green-50 p-2 rounded-lg border border-green-100 text-green-800">{event.meetingNote.decisions}</p>
                                                    </div>
                                                )}
                                                {event.meetingNote.nextSteps && (
                                                    <div>
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Siguientes Pasos</p>
                                                        <p className="text-slate-700">{event.meetingNote.nextSteps}</p>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="config" className="space-y-4 outline-none">
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800">Roles en Culto</h3>
                                    <p className="text-sm text-slate-500">Administra los roles y tareas específicas de este ministerio.</p>
                                </div>
                            </div>

                            <Card className="border-none shadow-sm ring-1 ring-slate-200/50 rounded-2xl overflow-hidden">
                                <CardHeader>
                                    <CardTitle className="text-base font-bold text-slate-900">Roles de Culto</CardTitle>
                                    <CardDescription>
                                        Define las tareas que realizan los miembros en los cultos (ej. Predicación, Audio, Ujier).
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <form
                                        onSubmit={async (e) => {
                                            e.preventDefault();
                                            const form = e.target as HTMLFormElement;
                                            const nameInput = form.elements.namedItem('dutyName') as HTMLInputElement;
                                            const typeInput = form.elements.namedItem('dutyType') as HTMLSelectElement; // Native Select
                                            const name = nameInput.value;
                                            const behaviorType = typeInput.value;

                                            if (!name) return;

                                            try {
                                                const token = localStorage.getItem('accessToken');
                                                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ministries/${id}/duties`, {
                                                    method: 'POST',
                                                    headers: {
                                                        'Content-Type': 'application/json',
                                                        'Authorization': `Bearer ${token}`
                                                    },
                                                    body: JSON.stringify({ name, behaviorType })
                                                });
                                                if (!res.ok) throw new Error('Error al crear tarea');
                                                toast.success('Rol de culto agregado');
                                                nameInput.value = '';
                                                fetchMinistry();
                                            } catch (error) {
                                                toast.error('Error al agregar rol');
                                            }
                                        }}
                                        className="flex flex-col sm:flex-row gap-3"
                                    >
                                        <div className="flex-1">
                                            <input
                                                name="dutyName"
                                                type="text"
                                                placeholder="Nuevo rol (ej: Audio, Proyección)..."
                                                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                                required
                                            />
                                        </div>
                                        <div className="w-full sm:w-48">
                                            <select
                                                name="dutyType"
                                                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none cursor-pointer"
                                            >
                                                <option value="STANDARD">Estándar</option>
                                                <option value="MUSIC_LEADER">Dirección de Alabanza</option>
                                                <option value="SPEAKER">Enseñanza</option>
                                                <option value="ANNOUNCEMENTS">Anuncios</option>
                                            </select>
                                        </div>
                                        <Button type="submit" size="sm" className="font-bold h-10">
                                            <Plus className="w-4 h-4 mr-2" />
                                            Agregar
                                        </Button>
                                    </form>

                                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                                        {ministry.serviceDuties?.map((duty) => (
                                            <div key={duty.id} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl shadow-sm group hover:border-slate-200 transition-colors">
                                                <div>
                                                    <span className="text-sm font-bold text-slate-700 block">{duty.name}</span>
                                                    <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded mt-1 inline-block">
                                                        {({
                                                            'STANDARD': 'Estándar',
                                                            'MUSIC_LEADER': 'Dirección de Alabanza',
                                                            'SPEAKER': 'Enseñanza',
                                                            'ANNOUNCEMENTS': 'Anuncios'
                                                        } as Record<string, string>)[duty.behaviorType] || 'Estándar'}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={async () => {
                                                        if (!confirm('¿Eliminar este rol?')) return;
                                                        try {
                                                            const token = localStorage.getItem('accessToken');
                                                            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ministries/${id}/duties/${duty.id}`, {
                                                                method: 'DELETE',
                                                                headers: { 'Authorization': `Bearer ${token}` }
                                                            });
                                                            toast.success('Rol eliminado');
                                                            fetchMinistry();
                                                        } catch (error) {
                                                            toast.error('Error al eliminar');
                                                        }
                                                    }}
                                                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                        {(!ministry.serviceDuties || ministry.serviceDuties.length === 0) && (
                                            <div className="col-span-full py-8 text-center border-2 border-dashed border-slate-100 rounded-xl">
                                                <p className="text-slate-400 text-xs font-medium">No hay roles de culto definidos.</p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
