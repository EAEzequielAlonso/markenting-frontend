'use client';

import { InventoryItem, InventoryMovement } from '@/types/inventory';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function MovementHistory({ item }: { item: InventoryItem }) {
    const [itemDetails, setItemDetails] = useState<InventoryItem | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await api.get(`/inventory/${item.id}`);
                setItemDetails(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [item.id]);

    if (loading) return <div className="p-4 text-center">Cargando historial...</div>;
    if (!itemDetails || !itemDetails.movements || itemDetails.movements.length === 0) return <div className="p-4 text-center">No hay movimientos registrados.</div>;

    return (
        <div className="max-h-[400px] overflow-y-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Cant.</TableHead>
                        <TableHead>Motivo</TableHead>
                        <TableHead>Usuario</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {itemDetails.movements.map((mov) => (
                        <TableRow key={mov.id}>
                            <TableCell className="text-xs text-slate-500">
                                {new Date(mov.date).toLocaleDateString()} {new Date(mov.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </TableCell>
                            <TableCell>
                                <Badge variant={mov.type === 'IN' ? 'secondary' : 'destructive'} className="text-[10px]">
                                    {mov.type === 'IN' ? 'INGRESO' : 'EGRESO'}
                                </Badge>
                            </TableCell>
                            <TableCell className="font-bold">{mov.quantity}</TableCell>
                            <TableCell>
                                <div className="text-sm">{mov.reason}</div>
                                {mov.observation && <div className="text-xs text-slate-400 italic">{mov.observation}</div>}
                            </TableCell>
                            <TableCell className="text-xs text-slate-500">
                                {mov.registeredBy?.person?.fullName || 'Sistema'}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
