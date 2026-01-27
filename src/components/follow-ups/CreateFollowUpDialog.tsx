'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface CreateFollowUpDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export default function CreateFollowUpDialog({ open, onOpenChange, onSuccess }: CreateFollowUpDialogProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, reset } = useForm();

    const onSubmit = async (data: any) => {
        setIsLoading(true);
        try {
            await api.post('/follow-ups', data);
            toast.success('Persona agregada a seguimiento');
            onSuccess();
            onOpenChange(false);
            reset();
        } catch (error: any) {
            toast.error('Error al crear seguimiento');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Nuevo Seguimiento</DialogTitle>
                    <DialogDescription>
                        Registra una nueva persona para seguimiento pastoral.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Nombre</Label>
                            <Input {...register('firstName', { required: true })} placeholder="Ej. Juan" />
                        </div>
                        <div className="space-y-2">
                            <Label>Apellido</Label>
                            <Input {...register('lastName', { required: true })} placeholder="Ej. Pérez" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Teléfono</Label>
                        <Input {...register('phone')} placeholder="Ej. +54 9 11..." />
                    </div>

                    <div className="space-y-2">
                        <Label>Email (Opcional)</Label>
                        <Input {...register('email')} type="email" placeholder="juan@example.com" />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
                        <Button type="submit" disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700">
                            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Crear Seguimiento
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
