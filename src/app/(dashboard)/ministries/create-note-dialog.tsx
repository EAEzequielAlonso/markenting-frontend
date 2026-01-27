'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface CreateNoteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    ministryId: string;
    onSuccess: () => void;
}

export function CreateNoteDialog({ open, onOpenChange, ministryId, onSuccess }: CreateNoteDialogProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [events, setEvents] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        eventId: '',
        summary: '',
        decisions: '',
        nextSteps: ''
    });

    useEffect(() => {
        if (open) {
            fetchMinistryEvents();
            setFormData({
                eventId: '',
                summary: '',
                decisions: '',
                nextSteps: ''
            });
        }
    }, [open]);

    const fetchMinistryEvents = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ministries/${ministryId}/events`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                // Filter events that happened in the past or today, ideally
                setEvents(data);
            }
        } catch (error) {
            console.error('Error fetching ministry events', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.eventId) {
            toast.error('Selecciona un evento');
            return;
        }

        setIsLoading(true);

        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ministries/events/${formData.eventId}/notes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    summary: formData.summary,
                    decisions: formData.decisions,
                    nextSteps: formData.nextSteps
                })
            });

            if (!res.ok) throw new Error('Error al guardar nota');

            toast.success('Bitácora guardada exitosamente');
            onSuccess();
            onOpenChange(false);
        } catch (error) {
            console.error(error);
            toast.error('Ocurrió un error al guardar la nota');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] rounded-3xl p-6">
                <DialogHeader className="mb-4">
                    <DialogTitle className="text-xl font-black text-slate-900 tracking-tight">Nueva Bitácora</DialogTitle>
                    <DialogDescription>
                        Registra los acuerdos y notas de una reunión o evento.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="event" className="font-bold text-xs uppercase text-slate-500">Evento Asociado</Label>
                        <Select
                            value={formData.eventId}
                            onValueChange={(val) => setFormData({ ...formData, eventId: val })}
                        >
                            <SelectTrigger className="rounded-xl border-slate-200">
                                <SelectValue placeholder="Seleccionar reunión..." />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-slate-200 max-h-[200px]">
                                {events.map((e: any) => (
                                    <SelectItem key={e.id} value={e.id}>
                                        {e.title} - {format(new Date(e.startDate), "d MMM, HH:mm", { locale: es })}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="summary" className="font-bold text-xs uppercase text-slate-500">Resumen General</Label>
                        <Textarea
                            id="summary"
                            placeholder="¿Qué se discutió?"
                            value={formData.summary}
                            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                            className="rounded-xl border-slate-200 focus:ring-primary/20 min-h-[80px]"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="decisions" className="font-bold text-xs uppercase text-slate-500">Acuerdos / Decisiones</Label>
                        <Textarea
                            id="decisions"
                            placeholder="¿Qué se decidió?"
                            value={formData.decisions}
                            onChange={(e) => setFormData({ ...formData, decisions: e.target.value })}
                            className="rounded-xl border-slate-200 focus:ring-primary/20 min-h-[80px]"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="nextSteps" className="font-bold text-xs uppercase text-slate-500">Siguientes Pasos</Label>
                        <Textarea
                            id="nextSteps"
                            placeholder="Tareas pendientes o próximos temas..."
                            value={formData.nextSteps}
                            onChange={(e) => setFormData({ ...formData, nextSteps: e.target.value })}
                            className="rounded-xl border-slate-200 focus:ring-primary/20 min-h-[80px]"
                        />
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl font-bold">
                            Cancelar
                        </Button>
                        <Button type="submit" className="rounded-xl font-bold gap-2" disabled={isLoading}>
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                            Guardar Bitácora
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
