import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';
import { RefreshCcw } from 'lucide-react';

export function LoansManagement() {
    const { token, churchId } = useAuth();
    const [loans, setLoans] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchLoans = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/library/loans/active`, {
                headers: { Authorization: `Bearer ${token}`, 'x-church-id': churchId || '' }
            });
            if (res.ok) {
                const data = await res.json();
                setLoans(data);
                console.log(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (churchId) fetchLoans();
    }, [churchId]);

    const handleReturn = async (loanId: string) => {
        if (!confirm('¿Confirmar devolución del libro?')) return;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/library/loans/${loanId}/return`, {
                method: 'POST', // or PUT depending on backend, controller says POST
                headers: { Authorization: `Bearer ${token}`, 'x-church-id': churchId || '' }
            });

            if (res.ok) {
                toast.success('Libro devuelto exitosamente');
                fetchLoans();
            } else {
                toast.error('Error al devolver el libro');
            }
        } catch (error) {
            console.error(error);
            toast.error('Error de conexión');
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Préstamos Activos</CardTitle>
                <Button variant="ghost" size="sm" onClick={fetchLoans}>
                    <RefreshCcw className="w-4 h-4 mr-2" /> Actualizar
                </Button>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="text-center py-4">Cargando...</div>
                ) : loans.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No hay libros prestados actualmente.</div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Libro</TableHead>
                                <TableHead>Prestado a</TableHead>
                                <TableHead>Fecha Préstamo</TableHead>
                                <TableHead>Vencimiento</TableHead>
                                <TableHead>Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loans.map((loan) => (
                                <TableRow key={loan.id}>
                                    <TableCell className="font-medium">
                                        {loan.book.title}
                                        {loan.book.ownerMember && (
                                            <div className="text-xs text-gray-500">Prop: {loan.book.ownerMember.person?.fullName}</div>
                                        )}
                                    </TableCell>
                                    <TableCell>{loan.borrower?.person?.fullName}</TableCell>
                                    <TableCell>{new Date(loan.outDate).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <span className={new Date(loan.dueDate) < new Date() ? 'text-red-600 font-bold' : ''}>
                                            {new Date(loan.dueDate).toLocaleDateString()}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <Button size="sm" variant="outline" onClick={() => handleReturn(loan.id)}>
                                            Devolver
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}
