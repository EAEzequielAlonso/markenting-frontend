'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface PrayerRequestDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
    requestToEdit?: any;
}

export default function PrayerRequestDialog({ open, onOpenChange, onSuccess, requestToEdit }: PrayerRequestDialogProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, reset, setValue, watch } = useForm({
        defaultValues: {
            motive: '',
            visibility: 'PUBLIC',
            isAnonymous: false
        }
    });

    useEffect(() => {
        if (open) {
            if (requestToEdit) {
                reset({
                    motive: requestToEdit.motive,
                    visibility: requestToEdit.visibility,
                    isAnonymous: requestToEdit.isAnonymous
                });
            } else {
                reset({
                    motive: '',
                    visibility: 'PUBLIC',
                    isAnonymous: false
                });
            }
        }
    }, [open, requestToEdit, reset]);

    const onSubmit = async (data: any) => {
        setIsLoading(true);
        try {
            if (requestToEdit) {
                await api.put(`/prayers/${requestToEdit.id}`, { motive: data.motive }); // Edit only motive
                toast.success('Petición actualizada');
            } else {
                await api.post('/prayers', data);
                toast.success('Petición creada');
            }
            onSuccess();
            onOpenChange(false);
        } catch (error: any) {
            toast.error('Error al guardar la petición');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{requestToEdit ? 'Editar Petición' : 'Nueva Petición de Oración'}</DialogTitle>
                    <DialogDescription>
                        Comparte tu carga con la iglesia.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Motivo de Oración</Label>
                        <Textarea
                            {...register('motive', { required: true })}
                            placeholder="Describe brevemente tu petición..."
                            className="min-h-[120px]"
                        />
                    </div>

                    {!requestToEdit && (
                        <>
                            <div className="space-y-2">
                                <Label>Privacidad</Label>
                                <Select onValueChange={(val) => setValue('visibility', val)} defaultValue="PUBLIC">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PUBLIC">Pública (Toda la iglesia)</SelectItem>
                                        <SelectItem value="LEADERS_ONLY">Solo Líderes y Pastores</SelectItem>
                                        <SelectItem value="PRIVATE">Privada (Solo yo)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center space-x-2 pt-2">
                                <Switch
                                    id="anonymous-mode"
                                    checked={watch('isAnonymous')}
                                    onCheckedChange={(checked) => setValue('isAnonymous', checked)}
                                />
                                <Label htmlFor="anonymous-mode" className="font-normal cursor-pointer">
                                    Publicar como Anónimo
                                    <span className="block text-xs text-slate-400">Tu nombre será visible solo para pastores.</span>
                                </Label>
                            </div>
                        </>
                    )}

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
                        <Button type="submit" disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700">
                            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {requestToEdit ? 'Guardar Cambios' : 'Publicar Petición'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
