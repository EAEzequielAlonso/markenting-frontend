'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InventoryItemCategory } from '@/types/inventory';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Textarea } from '@/components/ui/textarea';

export default function CreateItemForm({ onSuccess }: { onSuccess: () => void }) {
    const { register, handleSubmit, setValue } = useForm();
    const [loading, setLoading] = useState(false);
    const [ministries, setMinistries] = useState<{ id: string; name: string }[]>([]);

    useEffect(() => {
        const fetchMinistries = async () => {
            try {
                const res = await api.get('/ministries');
                setMinistries(res.data);
            } catch (error) {
                console.error('Error fetching ministries:', error);
            }
        };
        fetchMinistries();
    }, []);

    const onSubmit = async (data: any) => {
        try {
            setLoading(true);
            await api.post('/inventory', {
                ...data,
                initialQuantity: parseInt(data.initialQuantity) || 0,
                ministryId: (data.ministryId && data.ministryId !== 'none') ? data.ministryId : undefined
            });
            onSuccess();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label>Nombre del Ítem</Label>
                <Input {...register('name')} placeholder="Ej: Sillas Plásticas" required />
            </div>

            <div className="space-y-2">
                <Label>URL de Imagen (Opcional)</Label>
                <Input {...register('imageUrl')} placeholder="https://..." />
            </div>

            <div className="space-y-2">
                <Label>Categoría</Label>
                <Select onValueChange={(val) => setValue('category', val)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona..." />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.values(InventoryItemCategory).map((cat) => (
                            <SelectItem key={cat} value={cat}>
                                {{
                                    [InventoryItemCategory.FURNITURE]: 'Mobiliario',
                                    [InventoryItemCategory.SOUND]: 'Sonido',
                                    [InventoryItemCategory.INSTRUMENTS]: 'Instrumentos',
                                    [InventoryItemCategory.TECHNOLOGY]: 'Tecnología',
                                    [InventoryItemCategory.LIGHTING]: 'Iluminación',
                                    [InventoryItemCategory.KITCHEN]: 'Cocina',
                                    [InventoryItemCategory.STATIONERY]: 'Papelería',
                                    [InventoryItemCategory.DECORATION]: 'Decoración',
                                    [InventoryItemCategory.OTHER]: 'Otros',
                                }[cat] || cat}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label>Ministerio (Opcional)</Label>
                <Select onValueChange={(val) => setValue('ministryId', val)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Asignar a un ministerio..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="none">-- Ninguno --</SelectItem>
                        {ministries.map((min) => (
                            <SelectItem key={min.id} value={min.id}>{min.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label>Stock Inicial</Label>
                <Input type="number" {...register('initialQuantity')} placeholder="0" min="0" />
            </div>

            <div className="space-y-2">
                <Label>Ubicación (Opcional)</Label>
                <Input {...register('location')} placeholder="Ej: Pasillo A" />
            </div>

            <div className="space-y-2">
                <Label>Descripción</Label>
                <Textarea {...register('description')} placeholder="Detalles adicionales..." />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Guardando...' : 'Crear Ítem'}
            </Button>
        </form>
    );
}
