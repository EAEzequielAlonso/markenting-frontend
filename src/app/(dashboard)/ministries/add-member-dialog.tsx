'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ChurchMember, MinistryRole } from "@/types/auth-types";

interface AddMemberDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    ministryId: string;
    onSuccess: () => void;
}

export function AddMemberDialog({ open, onOpenChange, ministryId, onSuccess }: AddMemberDialogProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [members, setMembers] = useState<ChurchMember[]>([]);
    const [formData, setFormData] = useState({
        memberId: '',
        role: MinistryRole.TEAM_MEMBER,
        status: 'active'
    });

    useEffect(() => {
        if (open) {
            fetchMembers();
            setFormData({
                memberId: '',
                role: MinistryRole.TEAM_MEMBER,
                status: 'active'
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
        if (!formData.memberId) {
            toast.error('Selecciona un miembro');
            return;
        }

        setIsLoading(true);

        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ministries/${ministryId}/members`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    memberId: formData.memberId,
                    role: formData.role
                })
            });

            if (!res.ok) throw new Error('Error al añadir miembro');

            toast.success('Miembro añadido al ministerio');
            onSuccess();
            onOpenChange(false);
        } catch (error) {
            console.error(error);
            toast.error('No se pudo añadir el miembro (quizás ya está en el ministerio)');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] rounded-3xl p-6">
                <DialogHeader className="mb-4">
                    <DialogTitle className="text-xl font-black text-slate-900 tracking-tight">Añadir Integrante</DialogTitle>
                    <DialogDescription>
                        Selecciona un miembro de la iglesia para unirlo al equipo.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="member" className="font-bold text-xs uppercase text-slate-500">Miembro</Label>
                        <Select
                            value={formData.memberId}
                            onValueChange={(val) => setFormData({ ...formData, memberId: val })}
                        >
                            <SelectTrigger className="rounded-xl border-slate-200">
                                <SelectValue placeholder="Seleccionar persona..." />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-slate-200 max-h-[200px]">
                                {members.map((m: any) => (
                                    <SelectItem key={m.id} value={m.id}>
                                        {m.person?.firstName} {m.person?.lastName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="role" className="font-bold text-xs uppercase text-slate-500">Rol en el Ministerio</Label>
                        <Select
                            value={formData.role}
                            onValueChange={(val) => setFormData({ ...formData, role: val as MinistryRole })}
                        >
                            <SelectTrigger className="rounded-xl border-slate-200">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-slate-200">
                                <SelectItem value={MinistryRole.TEAM_MEMBER}>Miembro del Equipo</SelectItem>
                                <SelectItem value={MinistryRole.COORDINATOR}>Coordinador</SelectItem>
                                <SelectItem value={MinistryRole.LEADER}>Líder</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl font-bold">
                            Cancelar
                        </Button>
                        <Button type="submit" className="rounded-xl font-bold gap-2" disabled={isLoading}>
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                            Añadir Integrante
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
