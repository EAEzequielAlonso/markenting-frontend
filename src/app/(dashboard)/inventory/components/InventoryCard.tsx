import { InventoryItem, InventoryItemCategory, InventoryMovementType } from '@/types/inventory';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, History, Box, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';

interface InventoryCardProps {
    item: InventoryItem;
    onMovement: (item: InventoryItem, type: InventoryMovementType) => void;
    onHistory: (item: InventoryItem) => void;
    categoryLabel: string;
}

export default function InventoryCard({ item, onMovement, onHistory, categoryLabel }: InventoryCardProps) {
    const [imgError, setImgError] = useState(false);

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col h-full border-slate-200">
            <div className="relative h-48 w-full bg-slate-100 overflow-hidden flex items-center justify-center">
                {item.imageUrl && !imgError ? (
                    <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center text-slate-300">
                        <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
                        <span className="text-xs font-medium uppercase tracking-wider">Sin Imagen</span>
                    </div>
                )}
                <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm shadow-sm font-semibold text-slate-700">
                        {categoryLabel}
                    </Badge>
                </div>
            </div>

            <CardContent className="p-4 flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-slate-800 line-clamp-1" title={item.name}>{item.name}</h3>
                </div>

                {item.description && (
                    <p className="text-sm text-slate-500 line-clamp-2 mb-4 h-10">{item.description}</p>
                )}

                <div className="flex items-center justify-between mt-auto pt-2">
                    <div className="flex flex-col">
                        <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Stock</span>
                        <span className={`text-2xl font-bold ${item.quantity === 0 ? 'text-red-500' : 'text-slate-800'}`}>
                            {item.quantity}
                        </span>
                    </div>
                    {item.ministry && (
                        <div className="text-right">
                            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Ministerio</span>
                            <p className="text-sm font-semibold text-indigo-600 truncate max-w-[120px]">{item.ministry.name}</p>
                        </div>
                    )}
                </div>
            </CardContent>

            <CardFooter className="p-2 bg-slate-50 border-t border-slate-100 grid grid-cols-3 gap-1">
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-green-600 hover:text-green-700 hover:bg-green-100"
                    onClick={() => onMovement(item, InventoryMovementType.IN)}
                >
                    <Plus className="w-4 h-4 mr-1" /> Ingreso
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-red-500 hover:text-red-600 hover:bg-red-100"
                    onClick={() => onMovement(item, InventoryMovementType.OUT)}
                >
                    <Minus className="w-4 h-4 mr-1" /> Egreso
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-slate-600 hover:text-indigo-600 hover:bg-slate-200"
                    onClick={() => onHistory(item)}
                >
                    <History className="w-4 h-4 mr-1" /> Historial
                </Button>
            </CardFooter>
        </Card>
    );
}
