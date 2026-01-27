import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface LoanBookDialogProps {
    copyId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export function LoanBookDialog({ copyId, open, onOpenChange, onSuccess }: LoanBookDialogProps) {
    const { token, churchId } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [members, setMembers] = useState<any[]>([]);
    const [selectedMember, setSelectedMember] = useState<any>(null);
    const [dueDate, setDueDate] = useState('');

    const handleSearch = async () => {
        // Mock simple member search logic or reuse from Families
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/members`, {
                headers: { Authorization: `Bearer ${token}`, 'x-church-id': churchId as string }
            });
            const data = await res.json();
            const found = data.filter((m: any) => m.person.fullName.toLowerCase().includes(search.toLowerCase()));
            setMembers(found);
        } catch (e) {
            console.error(e);
        }
    };

    const handleLoan = async () => {
        if (!selectedMember) {
            toast.error('Debe seleccionar un miembro');
            return;
        }
        setIsLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/library/loans`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                    'x-church-id': churchId || ''
                },
                body: JSON.stringify({
                    bookId: copyId,
                    borrowerMemberId: selectedMember.id,
                    dueDate: dueDate || undefined // Enviar la fecha seleccionada
                })
            });

            if (!res.ok) throw new Error('Error creating loan');

            toast.success('Préstamo registrado');
            onOpenChange(false);
            if (onSuccess) onSuccess();
        } catch (error) {
            toast.error('Error al registrar préstamo');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Registrar Préstamo</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Buscar Miembro</Label>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSearch();
                            }}
                            className="flex gap-2"
                        >
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Nombre..."
                                autoFocus
                            />
                            <Button type="submit" variant="secondary">Buscar</Button>
                        </form>

                        {members.length > 0 && (
                            <div className="max-h-[150px] overflow-y-auto border rounded p-2 space-y-1 mt-2">
                                {members.map(m => (
                                    <div
                                        key={m.id}
                                        className={`p-2 text-sm cursor-pointer rounded ${selectedMember?.id === m.id ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
                                        onClick={() => setSelectedMember(m)}
                                    >
                                        {m.person.fullName}
                                    </div>
                                ))}
                            </div>
                        )}
                        {search && members.length === 0 && !isLoading && (
                            <p className="text-xs text-slate-500 italic">No se encontraron miembros.</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>Fecha de Devolución (Opcional)</Label>
                        <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
                        <Button disabled={!selectedMember || isLoading} onClick={handleLoan}>
                            {isLoading ? 'Registrando...' : 'Confirmar Préstamo'}
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}
