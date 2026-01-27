'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Eye, Plus, Pencil, CheckCircle, MessageSquare, Send, Save, ArrowRight } from 'lucide-react';
import { useState } from 'react';

function TaskResponseEditor({ initialResponse, onSave }: { initialResponse: string, onSave: (val: string) => void }) {
    const [response, setResponse] = useState(initialResponse || '');
    const hasChanged = response !== (initialResponse || '');

    return (
        <div className="space-y-2">
            <Textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Escribe aquí tu resolución, dudas o comentarios sobre la misión..."
                className="text-sm min-h-[120px] bg-white border-blue-200 shadow-sm focus:ring-blue-300 transition-all font-medium text-slate-700"
            />
            <div className={`flex justify-end transition-all duration-300 ${hasChanged ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1 pointer-events-none'}`}>
                <Button
                    size="sm"
                    className="h-8 bg-blue-600 hover:bg-blue-700 font-bold px-4 shadow-md shadow-blue-200"
                    onClick={() => onSave(response)}
                >
                    <Send className="w-3.5 h-3.5 mr-1.5" />
                    Enviar Resolución
                </Button>
            </div>
        </div>
    );
}

function TaskFeedbackEditor({ initialFeedback, onSave }: { initialFeedback: string, onSave: (val: string) => void }) {
    const [feedback, setFeedback] = useState(initialFeedback || '');
    const hasChanged = feedback !== (initialFeedback || '');

    return (
        <div className="space-y-2">
            <Textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Agrega una nota, corrección o palabra de ánimo aquí..."
                className="text-sm min-h-[100px] bg-white border-emerald-200 shadow-sm focus:ring-emerald-300 transition-all font-medium text-slate-700"
            />
            <div className={`flex justify-end transition-all duration-300 ${hasChanged ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1 pointer-events-none'}`}>
                <Button
                    size="sm"
                    className="h-8 bg-emerald-600 hover:bg-emerald-700 font-bold px-4 shadow-md shadow-emerald-200"
                    onClick={() => onSave(feedback)}
                >
                    <Save className="w-3.5 h-3.5 mr-1.5" />
                    Guardar Devolución
                </Button>
            </div>
        </div>
    );
}

interface TasksTabProps {
    sessions: any[];
    isCounselor: boolean;
    isCounselee: boolean;
    expandedTaskId: string | null;
    setExpandedTaskId: (id: string | null) => void;
    editingTaskId: string | null;
    setEditingTaskId: (id: string | null) => void;
    editingTaskData: any;
    setEditingTaskData: (val: any) => void;
    handleUpdateTask: (id: string, data: any) => void;
}

export default function TasksTab({
    sessions,
    isCounselor,
    isCounselee,
    expandedTaskId,
    setExpandedTaskId,
    editingTaskId,
    setEditingTaskId,
    editingTaskData,
    setEditingTaskData,
    handleUpdateTask
}: TasksTabProps) {
    const allTasks = sessions
        .flatMap((s: any) => (s.tasks || []).map((t: any) => ({ ...t, sessionDate: s.date })))
        .sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

    return (
        <Card className="border-none shadow-sm bg-white overflow-hidden">
            <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-slate-800 uppercase flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-amber-500" />
                        Bitácora de Tareas
                    </h3>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {allTasks.length > 0 ? (
                        allTasks.map((task: any) => (
                            <Card key={task.id} className="overflow-hidden border-l-4 border-l-amber-400 shadow-sm border-slate-200 group">
                                <div
                                    className="p-3 flex justify-between items-start cursor-pointer hover:bg-slate-50 transition-colors"
                                    onClick={() => setExpandedTaskId(expandedTaskId === task.id ? null : task.id)}
                                >
                                    <div className="min-w-0 pr-4">
                                        <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2 truncate">
                                            {task.title || 'Tarea o Misión'}
                                            <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                {expandedTaskId === task.id ? <Eye className="w-3 h-3 text-slate-300" /> : <Plus className="w-3 h-3 text-amber-500" />}
                                            </span>
                                        </h4>
                                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">
                                            {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : 'Sin fecha'} • {task.sessionDate ? `DE SESIÓN ${new Date(task.sessionDate).toLocaleDateString()}` : 'REGISTRO DIRECTO'}
                                        </p>
                                    </div>
                                    <Badge variant={task.status === 'COMPLETED' ? 'default' : 'outline'} className={`text-[9px] h-4 font-bold ${task.status === 'COMPLETED' ? 'bg-emerald-500 hover:bg-emerald-600' : 'text-amber-600 border-amber-200 bg-amber-50'}`}>
                                        {task.status === 'COMPLETED' ? 'COMPLETADA' : 'PENDIENTE'}
                                    </Badge>
                                </div>

                                {expandedTaskId === task.id && (
                                    <div className="p-3 pt-0 space-y-3 animate-in slide-in-from-top-2 duration-200">
                                        <div className="h-px bg-slate-100 mb-3" />

                                        {/* 1. TASK DESCRIPTION */}
                                        <div className="bg-slate-50/80 p-3 rounded-lg border border-slate-100">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-1.5">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Misión / Tarea:</span>
                                                </div>
                                                {isCounselor && editingTaskId !== task.id && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-5 w-5 text-slate-300 hover:text-primary transition-colors"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setEditingTaskId(task.id);
                                                            setEditingTaskData({ title: task.title, description: task.description });
                                                        }}
                                                    >
                                                        <Pencil className="w-2.5 h-2.5" />
                                                    </Button>
                                                )}
                                            </div>
                                            {editingTaskId === task.id ? (
                                                <div className="space-y-2 animate-in fade-in zoom-in-95 duration-200">
                                                    <Input
                                                        value={editingTaskData.title}
                                                        onChange={(e) => setEditingTaskData({ ...editingTaskData, title: e.target.value })}
                                                        className="h-8 text-xs bg-white"
                                                        placeholder="Título de la tarea"
                                                    />
                                                    <Textarea
                                                        value={editingTaskData.description}
                                                        onChange={(e) => setEditingTaskData({ ...editingTaskData, description: e.target.value })}
                                                        className="text-xs min-h-[80px] bg-white"
                                                        placeholder="Descripción detallada... (Usa guiones para viñetas)"
                                                    />
                                                    <div className="flex justify-end gap-2">
                                                        <Button variant="ghost" size="sm" className="h-7 text-[10px] font-bold" onClick={() => setEditingTaskId(null)}>Cancelar</Button>
                                                        <Button
                                                            size="sm"
                                                            className="h-7 text-[10px] bg-amber-600 hover:bg-amber-700 font-bold px-4"
                                                            onClick={async () => {
                                                                await handleUpdateTask(task.id, editingTaskData);
                                                                setEditingTaskId(null);
                                                            }}
                                                        >
                                                            Actualizar Tarea
                                                        </Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">{task.description}</p>
                                            )}
                                        </div>

                                        {/* 2. COUNSELEE RESPONSE */}
                                        <div className="bg-blue-50/40 p-4 rounded-xl border border-blue-100 shadow-sm relative overflow-hidden group/res">
                                            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover/res:opacity-30 transition-opacity">
                                                <MessageSquare className="w-8 h-8 text-blue-500" />
                                            </div>
                                            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block mb-3 flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-blue-500 shadow-sm shadow-blue-200" />
                                                Resolución del Aconsejado:
                                            </span>
                                            {isCounselee ? (
                                                <div className="space-y-3 animate-in slide-in-from-bottom-1 duration-200">
                                                    <TaskResponseEditor
                                                        initialResponse={task.counseleeResponse}
                                                        onSave={(val: string) => handleUpdateTask(task.id, { counseleeResponse: val, status: 'COMPLETED' })}
                                                    />
                                                    <p className="text-[9px] font-bold text-blue-400 italic flex items-center gap-1">
                                                        <CheckCircle className="w-3 h-3" />
                                                        Presiona "Enviar" para que tu consejero pueda revisar tu progreso.
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className={`text-sm leading-relaxed whitespace-pre-wrap p-3 rounded-lg border bg-white/50 ${task.counseleeResponse ? 'text-blue-900 border-blue-50' : 'text-slate-400 italic border-transparent'}`}>
                                                    {task.counseleeResponse || 'Pendiente de resolución por parte del aconsejado...'}
                                                </div>
                                            )}
                                        </div>

                                        {/* 3. COUNSELOR FEEDBACK */}
                                        <div className="bg-emerald-50/40 p-4 rounded-xl border border-emerald-100 shadow-sm relative overflow-hidden group/fb">
                                            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover/fb:opacity-30 transition-opacity">
                                                <CheckCircle className="w-8 h-8 text-emerald-500" />
                                            </div>
                                            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest block mb-3 flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-200" />
                                                Corrección / Devolución:
                                            </span>
                                            {isCounselor ? (
                                                <div className="space-y-3 animate-in slide-in-from-bottom-1 duration-200">
                                                    <TaskFeedbackEditor
                                                        initialFeedback={task.counselorFeedback}
                                                        onSave={(val: string) => handleUpdateTask(task.id, { counselorFeedback: val })}
                                                    />
                                                    <p className="text-[9px] font-bold text-emerald-400 italic">Tus comentarios son visibles para el aconsejado inmediatamente.</p>
                                                </div>
                                            ) : (
                                                <div className={`text-sm leading-relaxed whitespace-pre-wrap p-3 rounded-lg border bg-white/50 ${task.counselorFeedback ? 'text-emerald-900 border-emerald-50' : 'text-slate-400 italic border-transparent'}`}>
                                                    {task.counselorFeedback || 'Sin devoluciones por parte del consejero aún.'}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </Card>
                        ))
                    ) : (
                        <div className="text-center py-16 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                            <CheckCircle className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                            <p className="text-sm font-bold text-slate-400">No se han asignado tareas.</p>
                            <p className="text-xs text-slate-300 mt-1">Las tareas y misiones aparecerán en este log cronológico.</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
