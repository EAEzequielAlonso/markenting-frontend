'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { InventoryItem, InventoryItemCategory, InventoryMovementType } from '@/types/inventory';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Plus, Minus, History, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import CreateItemForm from './components/CreateItemForm';
import MovementForm from './components/MovementForm';
import MovementHistory from './components/MovementHistory';
import InventoryCard from './components/InventoryCard';

export default function InventoryPage() {
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // UI States
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    // Movement Modal State
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
    const [movementType, setMovementType] = useState<InventoryMovementType | null>(null);
    const [isMovementOpen, setIsMovementOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    const fetchItems = async () => {
        try {
            setLoading(true);
            const res = await api.get('/inventory');
            setItems(res.data);
        } catch (error) {
            console.error('Error fetching inventory:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleMovement = (item: InventoryItem, type: InventoryMovementType) => {
        setSelectedItem(item);
        setMovementType(type);
        setIsMovementOpen(true);
    };

    const handleHistory = (item: InventoryItem) => {
        setSelectedItem(item);
        setIsHistoryOpen(true);
    };

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const categoryLabels: Record<string, string> = {
        [InventoryItemCategory.FURNITURE]: 'Mobiliario',
        [InventoryItemCategory.SOUND]: 'Sonido',
        [InventoryItemCategory.INSTRUMENTS]: 'Instrumentos',
        [InventoryItemCategory.TECHNOLOGY]: 'Tecnología',
        [InventoryItemCategory.LIGHTING]: 'Iluminación',
        [InventoryItemCategory.KITCHEN]: 'Cocina',
        [InventoryItemCategory.STATIONERY]: 'Papelería',
        [InventoryItemCategory.DECORATION]: 'Decoración',
        [InventoryItemCategory.OTHER]: 'Otros',
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Inventario</h1>
                    <p className="text-slate-500">Gestión de bienes y recursos físicos</p>
                </div>
                <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Nuevo Ítem
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Total Ítems</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{items.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Bienes Totales</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {items.reduce((acc, item) => acc + item.quantity, 0)}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Categorías</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {new Set(items.map(i => i.category)).size}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex items-center gap-2 bg-white p-2 rounded-lg border max-w-sm">
                <Search className="w-4 h-4 text-slate-400" />
                <Input
                    placeholder="Buscar por nombre o categoría..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-0 focus-visible:ring-0"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {loading ? (
                    Array(8).fill(0).map((_, i) => (
                        <div key={i} className="h-[350px] bg-white rounded-xl border border-slate-200 animate-pulse bg-slate-100" />
                    ))
                ) : filteredItems.length === 0 ? (
                    <div className="col-span-full text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
                        <Package className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-slate-600"> inventario vacío</h3>
                        <p className="text-slate-400 mt-2">No se encontraron ítems con los filtros actuales.</p>
                    </div>
                ) : (
                    filteredItems.map((item) => (
                        <InventoryCard
                            key={item.id}
                            item={item}
                            onMovement={handleMovement}
                            onHistory={handleHistory}
                            categoryLabel={categoryLabels[item.category] || item.category}
                        />
                    ))
                )}
            </div>

            {/* Modals */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Nuevo Ítem de Inventario</DialogTitle>
                    </DialogHeader>
                    <CreateItemForm onSuccess={() => {
                        setIsCreateOpen(false);
                        fetchItems();
                    }} />
                </DialogContent>
            </Dialog>

            <Dialog open={isMovementOpen} onOpenChange={setIsMovementOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {movementType === InventoryMovementType.IN ? 'Registrar Ingreso (Entrada)' : 'Registrar Egreso (Salida)'}
                        </DialogTitle>
                    </DialogHeader>
                    {selectedItem && movementType && (
                        <MovementForm
                            item={selectedItem}
                            type={movementType}
                            onSuccess={() => {
                                setIsMovementOpen(false);
                                fetchItems();
                            }}
                        />
                    )}
                </DialogContent>
            </Dialog>

            <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Historial de Movimientos: {selectedItem?.name}</DialogTitle>
                    </DialogHeader>
                    {selectedItem && <MovementHistory item={selectedItem} />}
                </DialogContent>
            </Dialog>
        </div>
    );
}
