import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface CreateMinistryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function CreateMinistryDialog({ open, onOpenChange, onSuccess }: CreateMinistryDialogProps) {
    const { token, churchId } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [color, setColor] = useState('#3b82f6');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ministries`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                    'x-church-id': churchId || ''
                },
                body: JSON.stringify({ name, description, color })
            });

            if (!res.ok) throw new Error('Error creating ministry');

            toast.success('Ministerio creado correctamente');
            onSuccess();
            onOpenChange(false);
            setName('');
            setDescription('');
            setColor('#3b82f6');
        } catch (error) {
            toast.error('Error al crear ministerio');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Nuevo Ministerio</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nombre</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Descripción</Label>
                        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="color">Color Identificativo</Label>
                        <div className="flex gap-2 items-center">
                            <Input
                                id="color"
                                type="color"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                className="w-12 h-10 p-1"
                            />
                            <span className="text-sm text-gray-500">{color}</span>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Creando...' : 'Crear Ministerio'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
