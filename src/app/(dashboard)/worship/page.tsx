'use client';

import { useState } from 'react';
import PageContainer from '@/components/ui/PageContainer';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, Clock, ChevronRight, LayoutTemplate, Trash2, MoreVertical, Music, Users, AlertCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import api from '@/lib/api';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function WorshipPage() {
    const router = useRouter();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    // Delete State
    const [serviceToDelete, setServiceToDelete] = useState<any>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Fetch Services
    const { data: services, isLoading, mutate } = useSWR('/worship-services', async (url) => (await api.get(url)).data);
    // Fetch Templates (for creation dialog)
    const { data: templates } = useSWR('/worship-services/templates', async (url) => (await api.get(url)).data);

    const handleCreateService = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsCreating(true);
        const form = e.currentTarget;
        const formData = new FormData(form);
        const date = formData.get('date') as string;
        const templateId = formData.get('templateId') as string;

        try {
            const { data: newService } = await api.post('/worship-services', {
                date,
                templateId
            });
            toast.success('Culto creado exitosamente');
            setIsCreateOpen(false);
            mutate(); // Refresh list
            router.push(`/worship/${newService.id}`);
        } catch (error) {
            console.error(error);
            toast.error('Error al crear el culto');
        } finally {
            setIsCreating(false);
        }
    };

    const handleDeleteService = async () => {
        if (!serviceToDelete) return;
        setIsDeleting(true);
        try {
            await api.delete(`/worship-services/${serviceToDelete.id}`);
            toast.success('Culto eliminado correctamente');
            mutate();
            setServiceToDelete(null);
        } catch (error) {
            toast.error('No se pudo eliminar el culto');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <PageContainer
            title="Agenda de Cultos"
            description="Gestiona la planificación de los servicios generales."
            headerAction={
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2 bg-white hover:bg-slate-50 border-slate-200 text-slate-700" onClick={() => router.push('/worship/templates')}>
                        <LayoutTemplate className="w-4 h-4" />
                        Plantillas
                    </Button>
                    <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm ring-1 ring-indigo-500" onClick={() => setIsCreateOpen(true)}>
                        <Plus className="w-4 h-4" />
                        Programar Nuevo
                    </Button>
                </div>
            }
        >
            {/* Services List */}
            <div className="mt-6">
                {isLoading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-48 w-full rounded-2xl" />)}
                    </div>
                ) : services?.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
                        <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                            <Calendar className="w-8 h-8 text-indigo-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">No hay cultos programados</h3>
                        <p className="text-slate-500 max-w-sm text-center mb-8">
                            Comienza creando el próximo servicio dominical para organizar la liturgia y los equipos.
                        </p>
                        <Button onClick={() => setIsCreateOpen(true)} className="bg-indigo-600 hover:bg-indigo-700">Programar Primer Culto</Button>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services?.map((service: any) => {
                            const serviceDate = new Date(service.date);
                            const isPast = serviceDate < new Date();
                            const isToday = format(serviceDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

                            return (
                                <Card
                                    key={service.id}
                                    className={`group relative overflow-hidden transition-all duration-300 border hover:border-indigo-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer bg-white ${isPast ? 'opacity-80' : ''}`}
                                    onClick={() => router.push(`/worship/${service.id}`)}
                                >
                                    {/* Status Bar */}
                                    <div className={`absolute top-0 left-0 w-1 h-full ${isPast ? 'bg-slate-200' : isToday ? 'bg-indigo-500' : 'bg-slate-300 group-hover:bg-indigo-400 transition-colors'}`} />

                                    <CardHeader className="pb-3 pl-6">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-1">
                                                <Badge
                                                    variant="secondary"
                                                    className={`mb-2 font-bold uppercase tracking-wider text-[10px] ${isPast ? 'bg-slate-100 text-slate-500' :
                                                        isToday ? 'bg-indigo-100 text-indigo-700' :
                                                            'bg-slate-100 text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors'
                                                        }`}
                                                >
                                                    {isToday ? 'HOY' : isPast ? 'FINALIZADO' : 'PROGRAMADO'}
                                                </Badge>
                                                <h3 className="text-2xl font-bold text-slate-800 leading-tight">
                                                    {format(serviceDate, "d 'de' MMMM", { locale: es })}
                                                </h3>
                                                <p className="text-sm font-medium text-slate-500 flex items-center gap-1.5">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {format(serviceDate, 'HH:mm')} hs
                                                </p>
                                            </div>

                                            <div className="flex gap-1">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                                                            <MoreVertical className="w-4 h-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setServiceToDelete(service); }} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                                                            <Trash2 className="w-4 h-4 mr-2" />
                                                            Eliminar Culto
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="pl-6 pb-4">
                                        <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 mb-4 group-hover:border-indigo-50 group-hover:bg-indigo-50/30 transition-colors">
                                            <div className="flex items-start gap-2">
                                                <LayoutTemplate className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                                                <div>
                                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-0.5">Esquema de Reunion</p>
                                                    <p className="text-sm font-medium text-slate-700 line-clamp-2 leading-snug">
                                                        {service.topic || <span className="italic opacity-60">Sin tema asignado</span>}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>

                                    <CardFooter className="pl-6 pt-0 pb-5">
                                        <div className="w-full flex justify-between items-center text-xs font-bold text-slate-300 uppercase tracking-widest group-hover:text-indigo-600 transition-colors">
                                            <span>Ver Planificación</span>
                                            <ChevronRight className="w-4 h-4" />
                                        </div>
                                    </CardFooter>
                                </Card>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* Create Dialog */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Programar Nuevo Culto</DialogTitle>
                        <DialogDescription>Selecciona una plantilla base y la fecha del servicio.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateService} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Plantilla Base</Label>
                            <Select name="templateId" required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar plantilla..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {templates?.map((t: any) => (
                                        <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Fecha y Hora</Label>
                            <Input type="datetime-local" name="date" required />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>Cancelar</Button>
                            <Button type="submit" disabled={isCreating} className="bg-indigo-600 hover:bg-indigo-700">
                                {isCreating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Crear Culto
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Alert Dialog */}
            <AlertDialog open={!!serviceToDelete} onOpenChange={(open) => !open && !isDeleting && setServiceToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción eliminará permanentemente el culto del <strong>{serviceToDelete && format(new Date(serviceToDelete.date), "d 'de' MMMM", { locale: es })}</strong> y toda su planificación asociada.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
                        {/* We use a standard Button here instead of AlertDialogAction to prevent auto-closing */}
                        <Button
                            variant="destructive"
                            onClick={(e) => {
                                e.preventDefault();
                                handleDeleteService();
                            }}
                            disabled={isDeleting}
                        >
                            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}
                            Eliminar
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </PageContainer>
    );
}
