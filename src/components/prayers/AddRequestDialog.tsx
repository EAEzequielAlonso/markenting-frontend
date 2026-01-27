import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface AddRequestDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function AddRequestDialog({ open, onOpenChange, onSuccess }: AddRequestDialogProps) {
    const { token, churchId } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [motive, setMotive] = useState('');
    const [visibility, setVisibility] = useState('PUBLIC');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/prayers`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, 
                    'x-church-id': churchId || '' 
                },
                body: JSON.stringify({ motive, visibility })
            });

            if (!res.ok) throw new Error('Error creating request');

            toast.success('Petición compartida');
            onSuccess();
            onOpenChange(false);
            setMotive('');
            setVisibility('PUBLIC');
        } catch (error) {
            toast.error('Error al enviar la petición');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Nueva Petición de Oración</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="motive">¿Por qué quieres que oremos?</Label>
                        <Textarea 
                            id="motive" 
                            value={motive} 
                            onChange={(e) => setMotive(e.target.value)} 
                            placeholder="Comparte tu carga..."
                            className="min-h-[100px]"
                            required 
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="visibility">Visibilidad</Label>
                        <Select value={visibility} onValueChange={setVisibility}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="PUBLIC">Pública (Toda la iglesia)</SelectItem>
                                <SelectItem value="LEADERS_ONLY">Solo Líderes y Pastores</SelectItem>
                                <SelectItem value="PRIVATE">Privada (Solo Pastores)</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-gray-500">
                            {visibility === 'PUBLIC' && 'Todos los miembros podrán verla y orar por ti.'}
                            {visibility === 'LEADERS_ONLY' && 'Visible solo para líderes de ministerio y pastores.'}
                            {visibility === 'PRIVATE' && 'Confidencial. Solo los pastores principales la verán.'}
                        </p>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
                        <Button type="submit" disabled={isLoading || !motive.trim()}>
                            {isLoading ? 'Enviando...' : 'Publicar Petición'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
