import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import { Plus } from 'lucide-react';

interface CreateBookDialogProps {
    onBookCreated?: () => void;
}

export function CreateBookDialog({ onBookCreated }: CreateBookDialogProps) {
    const { token, churchId, user } = useAuth();
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        category: '',
        isbn: '',
        coverUrl: '',
        description: '',
        ownershipType: 'CHURCH', // Default for admins
        ownerMemberId: '', // If MEMBER
    });

    // Member search/select states
    const [memberSearch, setMemberSearch] = useState('');
    const [memberSearchResults, setMemberSearchResults] = useState<any[]>([]);
    const [isSearchingMember, setIsSearchingMember] = useState(false);

    const isMember = !user?.roles?.includes('ADMIN') && !user?.roles?.includes('PASTOR'); // Simplified check

    const handleMemberSearch = async () => {
        setIsSearchingMember(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/members`, {
                headers: { Authorization: `Bearer ${token}`, 'x-church-id': churchId as string }
            });
            const data = await res.json();
            // Simple Client-side filtering for MVP
            const found = data.filter((m: any) => m.person.fullName.toLowerCase().includes(memberSearch.toLowerCase()));
            setMemberSearchResults(found);
        } catch (e) {
            console.error(e);
            toast.error('Error buscando miembros');
        } finally {
            setIsSearchingMember(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleOwnershipChange = (value: string) => {
        setFormData({ ...formData, ownershipType: value });
    };

    const handleSubmit = async () => {
        if (!formData.title || !formData.author) {
            toast.error('Título y Autor son obligatorios');
            return;
        }

        setIsLoading(true);
        try {
            // Logic: If plain member (not admin), force ownership = MEMBER and ownerMemberId = user.memberId?
            // Backend requires ownerMemberId if Type=MEMBER.
            // We need to fetch current member ID? AuthContext usually stores it?
            // AuthContext stores `user`. User entity -> Member relation? 
            // Usually auth returns { user: { ..., memberId: '...' } } or similar.
            // Let's assume user.memberId exists or we need to pass it. 
            // If not available in context, we might fail. 
            // Use `user.member?.id` if available.

            // For MVP, passing ownership data:
            const payload: any = {
                ...formData,
                status: 'AVAILABLE'
            };

            // TODO: How to get MY member ID? 
            // If I am a member adding my book, ownership is MEMBER.
            // Backend should probably inject it from User if missing? 
            // Let's assume for now Manual Entry is for Admins mostly, OR we assume creating as Church.
            // For Member functionality, we need to know the Member ID.
            // Let's rely on backend @CurrentUser or similar if fetching member?
            // Or just allow Admins to specify. The requirement says Members can add.
            // Let's just implement explicit fields for now.

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/library/books`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                    'x-church-id': churchId || ''
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error('Error creating book');

            toast.success('Libro creado exitosamente');
            setOpen(false);
            setFormData({
                title: '', author: '', category: '', isbn: '', coverUrl: '',
                description: '', ownershipType: 'CHURCH', ownerMemberId: ''
            }); // Reset
            if (onBookCreated) onBookCreated();

        } catch (error) {
            console.error(error);
            toast.error('Error al crear el libro');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="w-4 h-4 mr-2" /> Nuevo Libro
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Agregar Nuevo Libro</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Título *</Label>
                            <Input name="title" value={formData.title} onChange={handleChange} placeholder="Ej. Liderazgo Espiritual" />
                        </div>
                        <div className="space-y-2">
                            <Label>Autor *</Label>
                            <Input name="author" value={formData.author} onChange={handleChange} placeholder="Ej. Oswald Sanders" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Categoría / Tema</Label>
                        <Input name="category" value={formData.category} onChange={handleChange} placeholder="Ej. Liderazgo, Teología..." />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>ISBN</Label>
                            <Input name="isbn" value={formData.isbn} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label>URL Portada</Label>
                            <Input name="coverUrl" value={formData.coverUrl} onChange={handleChange} placeholder="https://..." />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Descripción</Label>
                        <Textarea name="description" value={formData.description} onChange={handleChange} />
                    </div>

                    <div className="space-y-2">
                        <Label>Propiedad</Label>
                        <Select value={formData.ownershipType} onValueChange={handleOwnershipChange}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="CHURCH">Iglesia</SelectItem>
                                <SelectItem value="MEMBER">Miembro</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {formData.ownershipType === 'MEMBER' && (
                        <div className="space-y-3 p-3 bg-slate-50 border rounded-md">
                            <Label>Buscar Dueño del Libro</Label>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Buscar miembro por nombre..."
                                    value={memberSearch}
                                    onChange={(e) => setMemberSearch(e.target.value)}
                                />
                                <Button type="button" variant="secondary" onClick={handleMemberSearch} disabled={isSearchingMember}>
                                    {isSearchingMember ? '...' : 'Buscar'}
                                </Button>
                            </div>

                            {memberSearchResults.length > 0 && (
                                <div className="max-h-[150px] overflow-y-auto border rounded bg-white p-1">
                                    {memberSearchResults.map(m => (
                                        <div
                                            key={m.id}
                                            className={`p-2 text-sm cursor-pointer rounded hover:bg-slate-100 ${formData.ownerMemberId === m.id ? 'bg-primary/10 font-bold text-primary' : ''}`}
                                            onClick={() => setFormData({ ...formData, ownerMemberId: m.id })}
                                        >
                                            {m.person.fullName}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {formData.ownerMemberId && (
                                <div className="text-sm text-emerald-600 font-medium flex items-center gap-2">
                                    ✓ Miembro seleccionado (ID: ...{formData.ownerMemberId.slice(-4)})
                                </div>
                            )}
                        </div>
                    )}

                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? 'Guardando...' : 'Crear Libro'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
