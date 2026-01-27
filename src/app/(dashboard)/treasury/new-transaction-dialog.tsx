import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';

export function NewTransactionDialog({ onSuccess, accounts }: { onSuccess: () => void, accounts: any[] }) {
    const { churchId } = useAuth();
    const [open, setOpen] = useState(false);
    const [type, setType] = useState('income'); // income, expense, transfer
    const [amount, setAmount] = useState('');
    const [exchangeRate, setExchangeRate] = useState('1');
    const [description, setDescription] = useState('');
    const [sourceId, setSourceId] = useState('');
    const [destId, setDestId] = useState('');
    const [ministryId, setMinistryId] = useState('');
    const [ministries, setMinistries] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchMinistries = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003'}/ministries`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) setMinistries(await res.json());
        } catch (error) {
            console.error(error);
        }
    };

    // Filter accounts based on type
    const assetAccounts = accounts.filter(a => a.type === 'asset' || a.type === 'liability');
    const incomeCategories = accounts.filter(a => a.type === 'income');
    const expenseCategories = accounts.filter(a => a.type === 'expense');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('accessToken');
            const data = {
                description,
                amount: parseFloat(amount),
                exchangeRate: parseFloat(exchangeRate),
                sourceAccountId: sourceId,
                destinationAccountId: destId,
                ministryId: ministryId || null,
                date: new Date()
            };

            await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003'}/treasury/transactions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            setOpen(false);
            onSuccess();
            setAmount('');
            setDescription('');
            setExchangeRate('1');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open) fetchMinistries();
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">Nueva Transacción</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Registrar Movimiento</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div className="grid grid-cols-3 gap-2">
                        <Button type="button" variant={type === 'income' ? 'default' : 'outline'} onClick={() => setType('income')} className="w-full text-xs">Ingreso</Button>
                        <Button type="button" variant={type === 'expense' ? 'default' : 'outline'} onClick={() => setType('expense')} className="w-full text-xs">Gasto</Button>
                        <Button type="button" variant={type === 'transfer' ? 'default' : 'outline'} onClick={() => setType('transfer')} className="w-full text-xs">Transferencia</Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Monto</label>
                            <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Tasa de Cambio</label>
                            <Input type="number" value={exchangeRate} onChange={e => setExchangeRate(e.target.value)} placeholder="1.0" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Descripción</label>
                        <Input value={description} onChange={e => setDescription(e.target.value)} placeholder="Ej. Ofrenda Dominical" required />
                    </div>

                    {type === 'income' && (
                        <>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">¿De dónde viene? (Categoría)</label>
                                <Select onValueChange={setSourceId} required>
                                    <SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
                                    <SelectContent>
                                        {incomeCategories.map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">¿A dónde entra? (Cuenta)</label>
                                <Select onValueChange={setDestId} required>
                                    <SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
                                    <SelectContent>
                                        {assetAccounts.map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </>
                    )}

                    {type === 'expense' && (
                        <>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">¿De dónde sale? (Cuenta)</label>
                                <Select onValueChange={setSourceId} required>
                                    <SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
                                    <SelectContent>
                                        {assetAccounts.map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">¿En qué se gasta? (Categoría)</label>
                                <Select onValueChange={setDestId} required>
                                    <SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
                                    <SelectContent>
                                        {expenseCategories.map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </>
                    )}

                    {type === 'transfer' && (
                        <>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Origen (Cuenta)</label>
                                <Select onValueChange={setSourceId} required>
                                    <SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
                                    <SelectContent>
                                        {assetAccounts.map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Destino (Cuenta)</label>
                                <Select onValueChange={setDestId} required>
                                    <SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
                                    <SelectContent>
                                        {assetAccounts.filter(a => a.id !== sourceId).map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium italic text-slate-500">Ministerio / Departamento (Opcional)</label>
                        <Select onValueChange={setMinistryId} value={ministryId}>
                            <SelectTrigger><SelectValue placeholder="Seleccionar ministerio..." /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">Ninguno</SelectItem>
                                {ministries.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>

                    <Button type="submit" className="w-full mt-4 py-6 font-bold text-lg shadow-lg" disabled={loading}>
                        {loading ? 'Guardando...' : 'Registrar'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
