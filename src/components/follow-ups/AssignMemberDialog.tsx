'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import useSWR from 'swr';

interface AssignMemberDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
    person: any;
}

export default function AssignMemberDialog({ open, onOpenChange, onSuccess, person }: AssignMemberDialogProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { handleSubmit, setValue } = useForm();

    // Fetch members to assign
    // Depending on scale, we might need search. Basic fetching active members.
    const { data: members, isLoading: isLoadingMembers } = useSWR(open ? '/members' : null, async (url) => (await api.get(url)).data);

    const onSubmit = async (data: any) => {
        setIsLoading(true);
        try {
            await api.put(`/follow-ups/${person.id}/assign`, { memberId: data.memberId === 'NONE' ? null : data.memberId });
            toast.success('Asignación actualizada');
            onSuccess();
            onOpenChange(false);
        } catch (error: any) {
            toast.error('Error al asignar miembro');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Asignar Responsable</DialogTitle>
                    <DialogDescription>
                        Selecciona quién será el responsable de dar seguimiento a {person?.firstName} {person?.lastName}.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Select onValueChange={(val) => setValue('memberId', val)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccionar miembro..." />
                            </SelectTrigger>
                            <SelectContent className="max-h-[300px]">
                                <SelectItem value="NONE">-- Sin Asignar --</SelectItem>
                                {isLoadingMembers ? (
                                    <div className="p-2 text-xs text-center text-slate-400">Cargando...</div>
                                ) : (
                                    members?.map((m: any) => (
                                        <SelectItem key={m.id} value={m.id}>
                                            {m.person?.firstName} {m.person?.lastName}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
                        <Button type="submit" disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700">
                            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Guardar Asignación
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
