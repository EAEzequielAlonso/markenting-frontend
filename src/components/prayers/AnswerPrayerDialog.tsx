'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface AnswerPrayerDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
    request: any;
}

export default function AnswerPrayerDialog({ open, onOpenChange, onSuccess, request }: AnswerPrayerDialogProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, reset } = useForm();

    const onSubmit = async (data: any) => {
        setIsLoading(true);
        try {
            await api.put(`/prayers/${request.id}/answer`, { testimony: data.testimony });
            toast.success('¡Gloria a Dios! Petición marcada como respondida.');
            onSuccess();
            onOpenChange(false);
            reset();
        } catch (error: any) {
            toast.error('Error al actualizar la petición');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Testimonio de Respuesta</DialogTitle>
                    <DialogDescription>
                        Comparte brevemente cómo el Señor ha respondido a esta petición para edificación de la iglesia.
                    </DialogDescription>
                </DialogHeader>

                <div className="bg-slate-50 p-3 rounded-md mb-2 text-sm text-slate-600 italic border border-slate-100">
                    "{request?.motive}"
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Testimonio</Label>
                        <Textarea
                            {...register('testimony', { required: true })}
                            placeholder="Escribe tu testimonio aquí..."
                            className="min-h-[120px]"
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
                        <Button type="submit" disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Marcar como Respondida
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
