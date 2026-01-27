'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Plus, X, ClipboardList, Eye } from 'lucide-react';

interface SessionsTabProps {
    sessions: any[];
    isCounselor: boolean;
    type: string;
    isNewSessionOpen: boolean;
    setIsNewSessionOpen: (val: boolean) => void;
    newSessionData: any;
    setNewSessionData: (val: any) => void;
    handleCreateSession: () => void;
    selectedSessionId: string | null;
    setSelectedSessionId: (val: string | null) => void;
    newTaskTitle: string;
    setNewTaskTitle: (val: string) => void;
    newTaskDescription: string;
    setNewTaskDescription: (val: string) => void;
    handleAddTask: (sessionId: string) => void;
    setActiveTab: (tab: string) => void;
    setNoteFilterSessionId: (id: string) => void;
}

export default function SessionsTab({
    sessions,
    isCounselor,
    type,
    isNewSessionOpen,
    setIsNewSessionOpen,
    newSessionData,
    setNewSessionData,
    handleCreateSession,
    selectedSessionId,
    setSelectedSessionId,
    newTaskTitle,
    setNewTaskTitle,
    newTaskDescription,
    setNewTaskDescription,
    handleAddTask,
    setActiveTab,
    setNoteFilterSessionId
}: SessionsTabProps) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredSessions = sessions.filter(s =>
        (s.topics?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (new Date(s.date).toLocaleDateString().includes(searchTerm))
    );

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'SCHEDULED': return 'PROGRAMADO';
            case 'COMPLETED': return 'FINALIZADO';
            case 'CANCELLED': return 'CANCELADO';
            case 'PENDING': return 'PENDIENTE';
            default: return status;
        }
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'SCHEDULED': return 'bg-blue-50 text-blue-700 border-blue-200 shadow-blue-100/50 border-l-4 border-l-blue-500';
            case 'COMPLETED': return 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-emerald-100/50 border-l-4 border-l-emerald-500';
            case 'CANCELLED': return 'bg-red-50 text-red-700 border-red-200 shadow-red-100/50 border-l-4 border-l-red-500';
            case 'PENDING': return 'bg-amber-50 text-amber-700 border-amber-200 shadow-amber-100/50 border-l-4 border-l-amber-500';
            default: return 'bg-slate-50 text-slate-700 border-slate-200 border-l-4 border-l-slate-400';
        }
    };

    return (
        <Card className="border-none shadow-sm bg-white overflow-hidden">
            <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between gap-4">
                    <div className="relative flex-1 group">
                        <Input
                            placeholder="Buscar por tema o fecha..."
                            className="h-9 pl-9 text-xs bg-slate-50 border-none transition-all focus:bg-white focus:ring-1 ring-primary/20"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Eye className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 group-focus-within:text-primary transition-colors" />
                    </div>
                    {isCounselor && (
                        <Button
                            className="h-9 font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 animate-in fade-in zoom-in-95 duration-200"
                            onClick={() => setIsNewSessionOpen(!isNewSessionOpen)}
                        >
                            {isNewSessionOpen ? <X className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                            Nuevo Encuentro
                        </Button>
                    )}
                </div>

                {isNewSessionOpen && (
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-4 animate-in fade-in slide-in-from-top-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Fecha y Hora</Label>
                                <Input
                                    type="datetime-local"
                                    className="h-9 text-xs bg-white border-slate-200 focus:ring-primary/20"
                                    value={newSessionData.date}
                                    onChange={(e) => setNewSessionData({ ...newSessionData, date: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Duración (minutos)</Label>
                                <Input
                                    type="number"
                                    className="h-9 text-xs bg-white border-slate-200 focus:ring-primary/20"
                                    value={newSessionData.duration}
                                    onChange={(e) => setNewSessionData({ ...newSessionData, duration: parseInt(e.target.value) })}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Temas Principales / Título</Label>
                                <Input
                                    placeholder="Ej: Bases bíblicas del perdón, conflicto familiar..."
                                    className="h-9 text-xs bg-white border-slate-200 focus:ring-primary/20"
                                    value={newSessionData.topics}
                                    onChange={(e) => setNewSessionData({ ...newSessionData, topics: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Lugar / Ubicación</Label>
                                <Input
                                    placeholder="Ej: Oficina Iglesia, Zoom, Cafetería..."
                                    className="h-9 text-xs bg-white border-slate-200 focus:ring-primary/20"
                                    value={newSessionData.location || ''}
                                    onChange={(e) => setNewSessionData({ ...newSessionData, location: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                            <Button variant="ghost" size="sm" className="h-9 font-bold text-slate-400 hover:text-red-500 transition-colors" onClick={() => setIsNewSessionOpen(false)}>Cancelar</Button>
                            <Button size="sm" className="h-9 font-bold px-6 bg-primary hover:bg-primary/90 shadow-md shadow-primary/20" onClick={handleCreateSession}>Agendar Encuentro</Button>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredSessions.length > 0 ? (
                        filteredSessions.map((session: any) => (
                            <Card key={session.id} className={`overflow-hidden transition-all hover:shadow-md ${getStatusStyles(session.status)}`}>
                                <div className="p-3 border-b flex justify-between items-center bg-white/40">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-white rounded-lg shadow-sm">
                                            <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                                        </div>
                                        <div className="flex flex-col">
                                            <div className="font-bold text-xs text-slate-900">
                                                {new Date(session.date).toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'short' })}
                                            </div>
                                            <div className="text-[10px] text-slate-500 font-medium">
                                                {new Date(session.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {session.durationMinutes} min
                                            </div>
                                        </div>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className={`text-[9px] font-bold px-2 py-0.5 shadow-sm border-none ${session.status === 'COMPLETED' ? 'bg-emerald-500 text-white' :
                                            session.status === 'SCHEDULED' ? 'bg-blue-500 text-white' :
                                                'bg-slate-500 text-white'
                                            }`}
                                    >
                                        {getStatusLabel(session.status)}
                                    </Badge>
                                </div>
                                <CardContent className="p-3">
                                    {session.topics && (
                                        <div className="text-xs text-gray-700 mb-2">
                                            <span className="font-bold text-gray-500 mr-1 uppercase">Tema:</span> {session.topics}
                                        </div>
                                    )}
                                    {session.location && (
                                        <div className="text-[10px] text-gray-500 mb-2 italic">
                                            UBICACIÓN: {session.location}
                                        </div>
                                    )}
                                    <div className="flex gap-2 pt-2 border-t mt-2">
                                        <Button variant="ghost" size="sm" className="h-7 text-[10px] font-bold" onClick={() => { setActiveTab('NOTES'); setNoteFilterSessionId(session.id); }}>
                                            Ver Notas ({
                                                isCounselor ? (session.notes?.length || 0) :
                                                    (session.notes?.filter((n: any) => n.visibility === 'SHARED').length || 0)
                                            })
                                        </Button>
                                        {isCounselor && type !== 'INFORMAL' && (
                                            <Button variant="outline" size="sm" className="h-7 text-[10px] bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100 font-bold" onClick={() => setSelectedSessionId(selectedSessionId === session.id ? null : session.id)}>
                                                <ClipboardList className="w-3 h-3 mr-1" />
                                                Asignar Tarea
                                            </Button>
                                        )}
                                        {type !== 'INFORMAL' && (
                                            <Button variant="ghost" size="sm" className="h-7 text-[10px] font-bold" onClick={() => { setActiveTab('TASKS'); }}>
                                                Tareas ({session.tasks?.length || 0})
                                            </Button>
                                        )}
                                    </div>

                                    {selectedSessionId === session.id && (
                                        <div className="mt-3 p-3 bg-amber-50/50 rounded-lg border border-amber-100 space-y-2 animate-in zoom-in-95 duration-200">
                                            <Label className="text-[10px] font-bold text-amber-600 uppercase">Nueva Tarea para {new Date(session.date).toLocaleDateString()}</Label>
                                            <Input
                                                placeholder="Título o Temática"
                                                className="h-8 text-xs bg-white border-amber-100 shadow-sm"
                                                value={newTaskTitle}
                                                onChange={(e) => setNewTaskTitle(e.target.value)}
                                            />
                                            <Textarea
                                                placeholder="Instrucciones detalladas de la tarea... (Usa guiones para viñetas y espacios para párrafos)"
                                                className="h-20 text-xs bg-white border-amber-100 shadow-sm"
                                                value={newTaskDescription}
                                                onChange={(e) => setNewTaskDescription(e.target.value)}
                                            />
                                            <div className="flex justify-end gap-2 text-right">
                                                <Button variant="ghost" size="sm" className="h-7 text-[10px] font-bold" onClick={() => setSelectedSessionId(null)}>Cancelar</Button>
                                                <Button size="sm" className="h-7 text-[10px] bg-amber-600 hover:bg-amber-700 font-bold shadow-sm" onClick={() => handleAddTask(session.id)} disabled={!newTaskDescription.trim()}>Asignar</Button>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                            <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                            <p className="text-xs font-bold text-slate-400">No se encontraron encuentros.</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
