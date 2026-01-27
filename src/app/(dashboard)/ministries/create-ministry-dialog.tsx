'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Palette } from "lucide-react";
import { toast } from "sonner";
import { ChurchMember } from "@/types/auth-types";

interface CreateMinistryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

const COLORS = [
    { name: 'Azul', value: '#3b82f6' },
    { name: 'Rojo', value: '#ef4444' },
    { name: 'Verde', value: '#22c55e' },
    { name: 'Amarillo', value: '#eab308' },
    { name: 'Violeta', value: '#8b5cf6' },
    { name: 'Rosa', value: '#ec4899' },
    { name: 'Naranja', value: '#f97316' },
    { name: 'Gris', value: '#64748b' },
];

export function CreateMinistryDialog({ open, onOpenChange, onSuccess }: CreateMinistryDialogProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [members, setMembers] = useState<ChurchMember[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        color: '#3b82f6',
        leaderId: 'none'
    });

    useEffect(() => {
        if (open) {
            fetchMembers();
            // Reset form
            setFormData({
                name: '',
                description: '',
                color: '#3b82f6',
                leaderId: 'none'
            });
        }
    }, [open]);

    const fetchMembers = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/members`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setMembers(data);
            }
        } catch (error) {
            console.error('Error fetching members', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const token = localStorage.getItem('accessToken');
            const payload: any = {
                name: formData.name,
                description: formData.description,
                color: formData.color,
            };

            if (formData.leaderId && formData.leaderId !== 'none') {
                payload.leaderId = formData.leaderId;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ministries`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error('Error al crear ministerio');

            toast.success('Ministerio creado exitosamente');
            onSuccess();
            onOpenChange(false);
        } catch (error) {
            console.error(error);
            toast.error('Ocurrió un error al crear el ministerio');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] rounded-3xl p-6">
                <DialogHeader className="mb-4">
                    <DialogTitle className="text-xl font-black text-slate-900 tracking-tight">Nuevo Ministerio</DialogTitle>
                    <DialogDescription>
                        Crea un nuevo espacio para organizar un equipo de servicio.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="font-bold text-xs uppercase text-slate-500">Nombre del Ministerio</Label>
                        <Input
                            id="name"
                            placeholder="Ej. Alabanza, Ujieres..."
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="rounded-xl border-slate-200 focus:ring-primary/20 font-medium"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description" className="font-bold text-xs uppercase text-slate-500">Descripción (Opcional)</Label>
                        <Textarea
                            id="description"
                            placeholder="Breve descripción del propósito..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="rounded-xl border-slate-200 focus:ring-primary/20 min-h-[80px]"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="font-bold text-xs uppercase text-slate-500">Color Identificativo</Label>
                        <div className="flex flex-wrap gap-2">
                            {COLORS.map((c) => (
                                <button
                                    key={c.value}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, color: c.value })}
                                    className={`w-8 h-8 rounded-full transition-all ${formData.color === c.value ? 'ring-2 ring-slate-900 scale-110' : 'hover:scale-105'}`}
                                    style={{ backgroundColor: c.value }}
                                    title={c.name}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="leader" className="font-bold text-xs uppercase text-slate-500">Líder Principal (Opcional)</Label>
                        <Select
                            value={formData.leaderId}
                            onValueChange={(val) => setFormData({ ...formData, leaderId: val })}
                        >
                            <SelectTrigger className="rounded-xl border-slate-200">
                                <SelectValue placeholder="Seleccionar miembro..." />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-slate-200 max-h-[200px]">
                                <SelectItem value="none" className="text-slate-400 italic">-- Sin asignar --</SelectItem>
                                {members.map((m: any) => (
                                    <SelectItem key={m.id} value={m.id}>
                                        {m.person?.firstName} {m.person?.lastName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl font-bold">
                            Cancelar
                        </Button>
                        <Button type="submit" className="rounded-xl font-bold gap-2" disabled={isLoading}>
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                            Crear Ministerio
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
