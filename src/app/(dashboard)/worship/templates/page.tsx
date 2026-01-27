'use client';

import { useState } from 'react';
import PageContainer from '@/components/ui/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, LayoutTemplate, MoreVertical } from 'lucide-react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import api from '@/lib/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Trash2 } from 'lucide-react';

export default function TemplatesPage() {
    const router = useRouter();
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const { data: templates, mutate } = useSWR('/worship-services/templates', async (url) => (await api.get(url)).data);

    const handleCreateTemplate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = formData.get('name') as string;

        try {
            await api.post('/worship-services/templates', { name });
            toast.success('Plantilla creada');
            mutate();
            setIsCreateOpen(false);
        } catch (error) {
            toast.error('Error al crear plantilla');
        }
    };

    return (
        <PageContainer
            title="Plantillas de Culto"
            description="Define la estructura base para tus diferentes tipos de reuniones."
            backButton={true}
        >
            <div className="flex justify-end mb-6">
                <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Nueva Plantilla
                </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {templates?.map((t: any) => (
                    <Card
                        key={t.id}
                        className="hover:shadow-md transition-all cursor-pointer ring-1 ring-slate-200/50 hover:ring-indigo-200"
                        onClick={() => router.push(`/worship/templates/${t.id}`)}
                    >
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                {t.name}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (confirm('¿Eliminar esta plantilla?')) {
                                            api.delete(`/worship-services/templates/${t.id}`)
                                                .then(() => {
                                                    toast.success('Plantilla eliminada');
                                                    mutate();
                                                })
                                                .catch(() => toast.error('Error al eliminar'));
                                        }
                                    }}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-slate-500">
                                {t.sections?.length || 0} secciones configuradas
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Nueva Plantilla</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateTemplate} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Nombre de la Plantilla</Label>
                            <Input name="name" placeholder="Ej: Culto Dominical, Reunión de Oración..." required />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>Cancelar</Button>
                            <Button type="submit">Crear</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </PageContainer>
    );
}
