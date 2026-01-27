'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InventoryItem, InventoryMovementType } from '@/types/inventory';
import { useState } from 'react';
import api from '@/lib/api';
import { Textarea } from '@/components/ui/textarea';

const InReasons = [
    { value: 'PURCHASE', label: 'Compra' },
    { value: 'DONATION', label: 'Donación' },
    { value: 'TRANSFER', label: 'Traslado' },
    { value: 'ADJUSTMENT', label: 'Ajuste de Inventario' },
    { value: 'RETURN', label: 'Devolución' },
];

const OutReasons = [
    { value: 'BROKEN', label: 'Roto / Dañado' },
    { value: 'LOST', label: 'Perdido / Robado' },
    { value: 'DISCARDED', label: 'Descartado' },
    { value: 'TRANSFER', label: 'Traslado' },
    { value: 'ADJUSTMENT', label: 'Ajuste de Inventario' },
    { value: 'LOAN', label: 'Préstamo' },
];

interface Props {
    item: InventoryItem;
    type: InventoryMovementType;
    onSuccess: () => void;
}

export default function MovementForm({ item, type, onSuccess }: Props) {
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const quantity = watch('quantity');

    const onSubmit = async (data: any) => {
        try {
            setLoading(true);
            await api.post('/inventory/movements', {
                itemId: item.id,
                type: type,
                quantity: parseInt(data.quantity),
                reason: data.reason,
                observation: data.observation
            });
            onSuccess();
        } catch (error) {
            console.error(error);
            alert('Error al registrar movimiento. Verifique el stock si es una salida.');
        } finally {
            setLoading(false);
        }
    };

    const reasons = type === InventoryMovementType.IN ? InReasons : OutReasons;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="p-3 bg-slate-50 rounded-lg border text-sm text-slate-600">
                Ítem: <span className="font-semibold text-slate-900">{item.name}</span> <br />
                Stock Actual: <span className="font-semibold text-slate-900">{item.quantity}</span>
            </div>

            <div className="space-y-2">
                <Label>Cantidad</Label>
                <Input
                    type="number"
                    {...register('quantity', { required: true, min: 1, max: type === 'OUT' ? item.quantity : undefined })}
                    placeholder="1"
                    className={errors.quantity ? 'border-red-500' : ''}
                />
                {errors.quantity && <span className="text-xs text-red-500">Cantidad inválida</span>}
            </div>

            <div className="space-y-2">
                <Label>Motivo</Label>
                <Select onValueChange={(val) => setValue('reason', val)} required>
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona el motivo" />
                    </SelectTrigger>
                    <SelectContent>
                        {reasons.map((r) => (
                            <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label>Observación (Opcional)</Label>
                <Textarea {...register('observation')} placeholder="Detalles del movimiento..." />
            </div>

            <Button type="submit" className="w-full" disabled={loading} variant={type === 'OUT' ? 'destructive' : 'default'}>
                {loading ? 'Guardando...' : type === 'IN' ? 'Confirmar Ingreso' : 'Confirmar Egreso'}
            </Button>
        </form>
    );
}
