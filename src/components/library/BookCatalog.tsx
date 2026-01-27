import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Book, Search } from 'lucide-react';
import { BookDetailSheet } from './BookDetailSheet';

interface BookCatalogProps {
    refreshKey?: number;
    onRefresh?: () => void;
}

export function BookCatalog({ refreshKey, onRefresh }: BookCatalogProps) {
    const { token, churchId } = useAuth();
    const [books, setBooks] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
    const [search, setSearch] = useState('');

    const fetchBooks = async () => {
        if (!churchId) return;
        setIsLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/library/books`, {
                headers: { Authorization: `Bearer ${token}`, 'x-church-id': churchId }
            });
            if (res.ok) {
                const data = await res.json();
                setBooks(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, [churchId, token, refreshKey]); // Recargar cuando cambie refreshKey

    const filteredBooks = books.filter(b =>
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.author.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                    placeholder="Buscar por título o autor..."
                    className="pl-9"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {isLoading ? (
                <div>Cargando...</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredBooks.map((book) => (
                        <Card
                            key={book.id}
                            className="cursor-pointer hover:shadow-lg transition-all overflow-hidden flex flex-col h-full"
                            onClick={() => setSelectedBookId(book.id)}
                        >
                            <div className="h-40 bg-slate-100 flex items-center justify-center relative">
                                {book.coverUrl ? (
                                    <img src={book.coverUrl} alt={book.title} className="h-full w-full object-cover" />
                                ) : (
                                    <Book className="w-12 h-12 text-slate-300" />
                                )}

                                <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                                    {book.ownershipType === 'CHURCH' && (
                                        <Badge variant="default" className="bg-blue-600 hover:bg-blue-700">De la Iglesia</Badge>
                                    )}
                                    {book.ownershipType === 'MEMBER' && (
                                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200">
                                            Hno. {book.ownerMember?.person?.fullName}
                                        </Badge>
                                    )}
                                </div>
                                <div className="absolute bottom-2 left-2">
                                    {book.status === 'AVAILABLE' ? (
                                        <Badge className="bg-green-600 hover:bg-green-700">Disponible</Badge>
                                    ) : (
                                        <Badge variant="destructive">Prestado</Badge>
                                    )}
                                </div>
                            </div>
                            <CardContent className="p-4 flex-1 flex flex-col">
                                <h3 className="font-bold text-lg leading-tight line-clamp-2" title={book.title}>{book.title}</h3>
                                <p className="text-sm text-gray-500 mt-1 mb-3">{book.author}</p>
                                {book.category && <p className="text-xs text-gray-400 mb-2">{book.category}</p>}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {selectedBookId && (
                <BookDetailSheet
                    bookId={selectedBookId}
                    open={!!selectedBookId}
                    onOpenChange={(open) => !open && setSelectedBookId(null)}
                    onRefresh={fetchBooks}
                />
            )}
        </div>
    );
}
