'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Plus, Check, CheckCircle, Loader2, Calendar, Filter, Circle, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { DiscipleshipRole } from '@/types/discipleship';

export default function TasksTab({ discipleship, refresh, myRole }: any) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [filterMeetingId, setFilterMeetingId] = useState<string>('all');
    const { register, handleSubmit, reset, setValue } = useForm();

    // If I am not a DISCIPLE, I assume I can assign tasks (Discipler, Supervisor, or Admin)
    const canAssign = myRole !== DiscipleshipRole.DISCIPLE;

    // Flatten tasks and include meetingId explicitly
    const allTasks = discipleship.meetings?.flatMap((m: any) =>
        (m.tasks || []).map((t: any) => ({ ...t, meetingDate: m.date, meetingId: m.id }))
    ).sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()) || [];

    const filteredTasks = filterMeetingId === 'all'
        ? allTasks
        : allTasks.filter((t: any) => t.meetingId === filterMeetingId);

    const onAddTask = async (data: any) => {
        setIsLoading(true);
        try {
            await api.post(`/discipleships/${discipleship.id}/tasks`, {
                title: data.title,
                description: data.description, // User requested simple text field description
                meetingId: data.meetingId,
                dueDate: data.dueDate
            });
            toast.success('Tarea asignada');
            setIsDialogOpen(false);
            reset();
            refresh();
        } catch (error) {
            toast.error('Error al asignar tarea');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleTaskStatus = async (task: any) => {
        const newStatus = task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
        try {
            await api.patch(`/discipleships/tasks/${task.id}`, { status: newStatus });
            toast.success(newStatus === 'COMPLETED' ? 'Tarea completada' : 'Tarea pendiente');
            refresh();
        } catch (error) {
            toast.error('Error al actualizar tarea');
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                    <h3 className="text-lg font-semibold">Tareas y Compromisos</h3>
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-gray-400" />
                        <Select value={filterMeetingId} onValueChange={setFilterMeetingId}>
                            <SelectTrigger className="h-8 w-[200px] text-xs">
                                <SelectValue placeholder="Filtrar por encuentro" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas las tareas</SelectItem>
                                {(discipleship.meetings || []).map((m: any) => (
                                    <SelectItem key={m.id} value={m.id}>
                                        Encuentro {format(new Date(m.date), "dd/MM")}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                {canAssign && (
                    <Button onClick={() => setIsDialogOpen(true)} size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Asignar Tarea
                    </Button>
                )}
            </div>

            {filteredTasks.length === 0 ? (
                <div className="text-center py-10 border border-dashed rounded-lg bg-gray-50">
                    <p className="text-gray-500">No hay tareas pendientes.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredTasks.map((task: any) => (
                        <Card key={task.id} className="overflow-hidden hover:shadow-md transition-shadow border-slate-200">
                            <div className="flex items-start">
                                <div className={`w-1.5 self-stretch ${task.status === 'COMPLETED' ? 'bg-green-500' : 'bg-amber-400'}`} />
                                <div className="p-4 flex-1 flex gap-3">
                                    <button
                                        onClick={() => toggleTaskStatus(task)}
                                        className={`mt-1 flex-shrink-0 ${task.status === 'COMPLETED' ? 'text-green-600' : 'text-gray-300 hover:text-green-500'}`}
                                    >
                                        {task.status === 'COMPLETED' ? <CheckCircle className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                                    </button>

                                    <div className="flex-1 space-y-1">
                                        {task.title && <h4 className="font-bold text-sm text-slate-800">{task.title}</h4>}
                                        <p className={`text-sm font-medium leading-relaxed whitespace-pre-wrap ${task.status === 'COMPLETED' ? 'text-gray-500 line-through' : 'text-slate-800'}`}>
                                            {task.description}
                                        </p>
                                        <div className="flex items-center gap-3 text-xs text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {format(new Date(task.meetingDate), "d MMM yyyy", { locale: es })}
                                            </div>
                                            {task.dueDate && (
                                                <span className={new Date(task.dueDate) < new Date() && task.status !== 'COMPLETED' ? 'text-red-500 font-bold' : ''}>
                                                    • Vence: {format(new Date(task.dueDate), "d MMM", { locale: es })}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Asignar Tarea</DialogTitle>
                        <DialogDescription>Asigna una tarea relacionada a un encuentro específico.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onAddTask)} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Título (Opcional)</Label>
                            <Input {...register('title')} placeholder="Resumen de la tarea..." />
                        </div>
                        <div className="space-y-2">
                            <Label>Descripción</Label>
                            <Textarea {...register('description')} placeholder="Ej: Leer capítulo 3, Memorizar versículo..." required className="min-h-[100px]" />
                        </div>

                        <div className="space-y-2">
                            <Label>Encuentro Relacionado</Label>
                            <Select onValueChange={(val) => setValue('meetingId', val)} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar encuentro" />
                                </SelectTrigger>
                                <SelectContent>
                                    {(discipleship.meetings || []).map((m: any) => (
                                        <SelectItem key={m.id} value={m.id}>
                                            {format(new Date(m.date), "dd/MM/yyyy", { locale: es })} - {m.summary ? m.summary.substring(0, 20) + '...' : 'Encuentro'}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Fecha Límite (Opcional)</Label>
                            <Input type="date" {...register('dueDate')} />
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                Guardar
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
