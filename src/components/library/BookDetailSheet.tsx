import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Book, User, AlertCircle, CheckCircle } from 'lucide-react';
import { LoanBookDialog } from './LoanBookDialog';

interface BookDetailSheetProps {
    bookId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onRefresh?: () => void; // Agregado
}

export function BookDetailSheet({ bookId, open, onOpenChange, onRefresh }: BookDetailSheetProps) {
    const { token, churchId, user } = useAuth();
    // ... (rest of states same)
    const [book, setBook] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loanDialogOpen, setLoanDialogOpen] = useState(false);
    const [selectedCopyId, setSelectedCopyId] = useState<string | null>(null);

    const canManage = user?.roles?.includes('PASTOR') || user?.roles?.includes('LEADER') || user?.roles?.includes('ELDER') || user?.roles?.includes('ADMIN');

    const fetchBook = async () => {
        if (!bookId || !churchId) return;
        setIsLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/library/books`, {
                headers: { Authorization: `Bearer ${token}`, 'x-church-id': churchId }
            });
            if (res.ok) {
                const data = await res.json();
                const found = data.find((b: any) => b.id === bookId);
                setBook(found);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (open) fetchBook();
    }, [open, bookId]);

    const handleLoanClick = (copyId: string) => {
        setSelectedCopyId(copyId);
        setLoanDialogOpen(true);
    };

    // ... (logic helpers removed for brevity in this replace call if possible, keeping them to avoid deletion errors)
    const isAvailable = (copy: any) => {
        const activeLoan = copy.loans?.find((l: any) => !l.returnDate);
        return !activeLoan;
    };

    const getBorrowerName = (copy: any) => {
        const activeLoan = copy.loans?.find((l: any) => !l.returnDate);
        return activeLoan ? activeLoan.borrower?.person?.fullName : null;
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            {/* Content... */}
            <SheetContent className="w-[400px] sm:w-[600px] overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>Detalles del Libro</SheetTitle>
                </SheetHeader>

                {isLoading || !book ? (
                    <div className="py-8 text-center text-gray-500">Cargando...</div>
                ) : (
                    <div className="mt-6 space-y-6">
                        <div className="flex gap-4">
                            <div className="w-32 h-48 bg-slate-100 rounded flex-shrink-0 flex items-center justify-center">
                                {book.coverUrl ? (
                                    <img src={book.coverUrl} className="w-full h-full object-cover rounded" />
                                ) : (
                                    <Book className="w-12 h-12 text-slate-300" />
                                )}
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold leading-tight">{book.title}</h2>
                                <p className="text-lg text-gray-600 font-medium mt-1">{book.author}</p>

                                <div className="flex flex-wrap gap-2 mt-3">
                                    {book.ownershipType === 'CHURCH' ? (
                                        <Badge className="bg-blue-600">Iglesia</Badge>
                                    ) : (
                                        <Badge variant="outline" className="text-emerald-700 border-emerald-200 bg-emerald-50">
                                            Propiedad de: {book.ownerMember?.person?.fullName}
                                        </Badge>
                                    )}

                                    {book.status === 'AVAILABLE' ? (
                                        <Badge variant="outline" className="border-green-500 text-green-600 flex items-center gap-1">
                                            <CheckCircle className="w-3 h-3" /> Disponible
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline" className="border-amber-500 text-amber-600 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" /> Prestado
                                        </Badge>
                                    )}
                                </div>

                                <div className="mt-4 space-y-1 text-sm text-gray-600">
                                    {book.category && <p><span className="font-semibold">Categoría:</span> {book.category}</p>}
                                    <p><span className="font-semibold">ISBN:</span> {book.isbn || 'N/A'}</p>
                                    {book.code && <p><span className="font-semibold">Código:</span> {book.code}</p>}
                                </div>
                            </div>
                        </div>

                        {book.description && (
                            <div className="bg-slate-50 p-4 rounded-lg text-sm text-gray-700 italic border">
                                {book.description}
                            </div>
                        )}

                        <div className="border-t pt-4">
                            <h3 className="font-semibold text-lg mb-3">Estado y Acciones</h3>

                            {book.status === 'AVAILABLE' ? (
                                <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                                    <p className="text-green-800 mb-3 flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5" />
                                        El libro está disponible para préstamo.
                                    </p>
                                    {canManage && (
                                        <Button className="w-full" onClick={() => handleLoanClick(book.id)}>
                                            Registrar Préstamo
                                        </Button>
                                    )}
                                </div>
                            ) : (
                                <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 space-y-3">
                                    <p className="text-amber-800 flex items-center gap-2 font-medium">
                                        <AlertCircle className="w-5 h-5" />
                                        El libro se encuentra prestado.
                                    </p>
                                </div>
                            )}

                            {book.condition && (
                                <div className="mt-4">
                                    <p className="font-semibold text-sm mb-1">Observaciones / Estado:</p>
                                    <p className="text-sm text-gray-600">{book.condition}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {selectedCopyId && (
                    <LoanBookDialog
                        copyId={selectedCopyId}
                        open={loanDialogOpen}
                        onOpenChange={setLoanDialogOpen}
                        onSuccess={() => {
                            setLoanDialogOpen(false);
                            onOpenChange(false); // Cierra este panel lateral también
                            if (onRefresh) onRefresh(); // Refresca la lista global
                        }}
                    />
                )}
            </SheetContent>
        </Sheet>
    );
}
