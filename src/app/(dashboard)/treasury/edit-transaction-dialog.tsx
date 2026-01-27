'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit2, History, User, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface EditTransactionDialogProps {
    transaction: any;
    onSuccess: () => void;
}

export function EditTransactionDialog({ transaction, onSuccess }: EditTransactionDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [auditLogs, setAuditLogs] = useState<any[]>([]);

    const [form, setForm] = useState({
        description: transaction.description,
        amount: Number(transaction.amount),
        reason: ''
    });

    const fetchAuditLogs = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003'}/treasury/transactions/${transaction.id}/audit`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) setAuditLogs(await res.json());
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (open && showHistory) fetchAuditLogs();
    }, [open, showHistory]);

    const handleUpdate = async () => {
        if (!form.reason) {
            toast.error('Debes proporcionar un motivo para el cambio');
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003'}/treasury/transactions/${transaction.id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(form)
            });

            if (res.ok) {
                toast.success('Movimiento actualizado correctamente');
                onSuccess();
                setOpen(false);
            } else {
                toast.error('Error al actualizar el movimiento');
            }
        } catch (error) {
            console.error(error);
            toast.error('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-full transition-all">
                    <Edit2 className="w-3.5 h-3.5" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] border-none shadow-2xl overflow-hidden p-0">
                <DialogHeader className="p-6 bg-slate-50/50 border-b border-slate-100">
                    <div className="flex justify-between items-center">
                        <div>
                            <DialogTitle className="text-xl font-bold text-slate-800">Editar Movimiento</DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">
                                ID: {transaction.id.split('-')[0]}...
                            </DialogDescription>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowHistory(!showHistory)}
                            className={`text-xs h-8 ${showHistory ? 'bg-primary/5 border-primary/20 text-primary' : 'text-slate-500'}`}
                        >
                            <History className="w-3 h-3 mr-1.5" />
                            {showHistory ? 'Ver Formulario' : 'Ver Historial'}
                        </Button>
                    </div>
                </DialogHeader>

                {!showHistory ? (
                    <div className="p-6 space-y-5">
                        <div className="bg-amber-50/50 border border-amber-100/50 rounded-xl p-3 flex gap-3 text-amber-700">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <p className="text-[11px] font-medium leading-relaxed">
                                Este cambio modificará el saldo actual de las cuentas involucradas y quedará registrado en el historial de auditoría.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Descripción</Label>
                                <Input
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    className="h-11 bg-slate-50/50 border-slate-100 focus:ring-primary/20 transition-all font-medium"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Monto ({transaction.currency})</Label>
                                <Input
                                    type="number"
                                    value={form.amount}
                                    onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
                                    className="h-11 bg-slate-50/50 border-slate-100 focus:ring-primary/20 transition-all font-bold text-lg"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Motivo del Cambio</Label>
                                <Input
                                    placeholder="Ej: Error en el registro inicial..."
                                    value={form.reason}
                                    onChange={(e) => setForm({ ...form, reason: e.target.value })}
                                    className="h-11 bg-slate-50/50 border-slate-100 focus:ring-primary/20 transition-all font-medium"
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="p-0 max-h-[400px] overflow-y-auto">
                        {auditLogs.length === 0 ? (
                            <div className="py-20 text-center space-y-3">
                                <div className="p-4 bg-slate-50 rounded-full inline-flex text-slate-200">
                                    <History className="w-8 h-8" />
                                </div>
                                <p className="text-sm font-medium text-slate-400">No hay cambios registrados en este movimiento.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-50">
                                {auditLogs.map((log: any) => (
                                    <div key={log.id} className="p-5 space-y-3 bg-white hover:bg-slate-50/50 transition-colors">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-2">
                                                <div className="p-1.5 bg-primary/5 rounded-lg text-primary">
                                                    <User className="w-3.5 h-3.5" />
                                                </div>
                                                <span className="text-xs font-bold text-slate-700">{log.changedBy?.fullName || 'Sistema'}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                                <Clock className="w-3 h-3" />
                                                {new Date(log.createdAt).toLocaleString('es')}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <p className="text-[9px] font-bold text-slate-400 uppercase">Monto</p>
                                                <p className="text-xs font-bold text-slate-600">
                                                    ${Number(log.oldAmount).toLocaleString()} <span className="text-slate-300 font-normal ml-1">→</span> <span className="text-primary">${Number(log.newAmount).toLocaleString()}</span>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="p-2.5 bg-slate-50 rounded-lg">
                                            <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Motivo</p>
                                            <p className="text-xs font-medium text-slate-600 italic">"{log.changeReason}"</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {!showHistory && (
                    <DialogFooter className="p-6 bg-slate-50/30 border-t border-slate-50">
                        <Button variant="ghost" onClick={() => setOpen(false)} className="text-slate-500 font-bold hover:bg-slate-100">Cancelar</Button>
                        <Button
                            onClick={handleUpdate}
                            disabled={loading}
                            className="bg-primary hover:bg-primary/90 text-white font-bold px-8 shadow-lg shadow-primary/20 transition-all rounded-xl"
                        >
                            {loading ? 'Guardando...' : 'Confirmar Cambios'}
                        </Button>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
}
