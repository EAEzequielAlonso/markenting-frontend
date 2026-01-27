'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function MeetingDialog({ open, onOpenChange, onSuccess, meetingToEdit, discipleshipId }: any) {
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, reset, setValue, watch } = useForm({
        defaultValues: meetingToEdit || {
            title: '',
            date: '',
            durationMinutes: 60,
            type: 'PRESENCIAL',
            location: '',
            summary: '',
            color: '#6366f1'
        }
    });

    useEffect(() => {
        if (open) {
            if (meetingToEdit) {
                // Format for datetime-local: YYYY-MM-DDTHH:mm
                const dateStr = meetingToEdit.date ? new Date(meetingToEdit.date).toISOString().slice(0, 16) : '';
                reset({
                    ...meetingToEdit,
                    date: dateStr,
                    color: meetingToEdit.color || '#6366f1'
                });
            } else {
                reset({
                    title: '',
                    date: '',
                    durationMinutes: 60,
                    type: 'PRESENCIAL',
                    location: '',
                    summary: '',
                    color: '#6366f1'
                });
            }
        }
    }, [open, meetingToEdit, reset]);

    const onSubmit = async (data: any) => {
        setIsLoading(true);
        try {
            const payload = {
                title: data.title,
                date: data.date,
                durationMinutes: parseInt(data.durationMinutes),
                type: data.type,
                location: data.location,
                summary: data.summary,
                color: data.color
            };

            if (meetingToEdit) {
                await api.patch(`/discipleships/${discipleshipId}/meetings/${meetingToEdit.id}`, payload);
                toast.success('Encuentro actualizado');
            } else {
                await api.post(`/discipleships/${discipleshipId}/meetings`, payload);
                toast.success('Encuentro creado exitosamente');
            }

            if (onSuccess) onSuccess();
            onOpenChange(false);
            reset();
        } catch (error: any) {
            const msg = error.response?.data?.message || 'Error al guardar el encuentro';
            toast.error(Array.isArray(msg) ? msg[0] : msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                    <DialogTitle>{meetingToEdit ? 'Editar Encuentro' : 'Nuevo Encuentro'}</DialogTitle>
                    <DialogDescription>
                        Registra los detalles del encuentro de discipulado.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 space-y-2">
                            <Label>Título / Tema Principal <span className="text-red-500">*</span></Label>
                            <Input {...register('title', { required: true })} placeholder="Ej: Clase 1: Fundamentos de la Fe" />
                        </div>

                        <div className="space-y-2">
                            <Label>Modalidad</Label>
                            <Select
                                onValueChange={(val) => setValue('type', val)}
                                value={watch('type')}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="PRESENCIAL">Presencial</SelectItem>
                                    <SelectItem value="VIRTUAL">Virtual</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Duración (min)</Label>
                            <Input type="number" {...register('durationMinutes')} />
                        </div>

                        <div className="space-y-2">
                            <Label>Fecha y Hora <span className="text-red-500">*</span></Label>
                            <Input type="datetime-local" {...register('date', { required: true })} />
                        </div>

                        <div className="space-y-2">
                            <Label>Ubicación</Label>
                            <Input {...register('location')} placeholder={watch('type') === 'VIRTUAL' ? 'Link de reunión...' : 'Lugar físico...'} />
                        </div>

                        <div className="space-y-2">
                            <Label>Color en Agenda</Label>
                            <div className="flex gap-2">
                                <div
                                    className={`h-9 w-9 rounded-full bg-[#6366f1] cursor-pointer ring-2 ring-offset-2 ${watch('color') === '#6366f1' ? 'ring-slate-400' : 'ring-transparent'}`}
                                    onClick={() => setValue('color', '#6366f1')}
                                />
                                <Input type="color" {...register('color')} className="w-full h-9 p-1 cursor-pointer" />
                            </div>
                        </div>

                        <div className="col-span-2 space-y-2">
                            <Label>Resumen / Objetivos / Notas</Label>
                            <Textarea {...register('summary')} placeholder="Detalles de lo tratado..." className="min-h-[100px]" />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
                        <Button type="submit" disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700">
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            {meetingToEdit ? 'Guardar Cambios' : 'Crear Encuentro'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
