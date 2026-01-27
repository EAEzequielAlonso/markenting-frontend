'use client';


import { use, useState } from 'react';
import PageContainer from '@/components/ui/PageContainer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users, Music, Mic, BookOpen, AlertCircle, CheckCircle2, MoreVertical, Pencil, UserPlus, Loader2 } from 'lucide-react';
import useSWR from 'swr';
import api from '@/lib/api';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

// ... imports
import { PDFDownloadLink } from '@react-pdf/renderer';
import { WorshipServicePDF } from '@/components/pdf/WorshipServicePDF';
import { FileText, CheckCircle } from 'lucide-react';
export default function WorshipDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { data: service, isLoading, mutate } = useSWR(`/worship-services/${id}`, async (url) => (await api.get(url)).data);

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingSectionId, setEditingSectionId] = useState<string | null>(null);

    // Fix Timezone for Edit Dialog (Use Local Time format strings)
    const getDefaultDateValue = (dateString: string) => {
        const date = new Date(dateString);
        // "yyyy-MM-ddThh:mm" format for datetime-local input
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const handleUpdateService = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsEditing(true);
        const form = e.currentTarget;
        const formData = new FormData(form);
        const dateVal = formData.get('date') as string;
        const topic = formData.get('topic') as string;

        try {
            await api.patch(`/worship-services/${id}`, {
                date: dateVal ? new Date(dateVal).toISOString() : undefined,
                topic
            });
            toast.success('Información actualizada');
            setIsEditOpen(false);
            mutate();
        } catch (error) {
            console.error(error);
            toast.error('Error al actualizar');
        } finally {
            setIsEditing(false);
        }
    };

    const handleUpdateSectionContent = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const content = formData.get('content') as string;

        if (!editingSectionId) return;

        try {
            await api.patch(`/worship-services/sections/${editingSectionId}`, {
                content
            });
            toast.success('Contenido actualizado');
            setEditingSectionId(null);
            mutate();
        } catch (error) {
            toast.error('Error al actualizar');
        }
        try {
            await api.patch(`/worship-services/sections/${editingSectionId}`, {
                content
            });
            toast.success('Contenido actualizado');
            setEditingSectionId(null);
            mutate();
        } catch (error) {
            toast.error('Error al actualizar');
        }
    };

    const handleConfirmService = async () => {
        try {
            await api.patch(`/worship-services/${id}/confirm`);
            toast.success('Culto confirmado exitosamente');
            mutate();
        } catch (error) {
            toast.error('Error al confirmar el culto');
        }
    };

    if (isLoading) return <PageContainer title="Cargando..." description=""><Skeleton className="w-full h-96" /></PageContainer>;
    if (!service) return <PageContainer title="Error" description=""><p>Culto no encontrado</p></PageContainer>;

    // Calculate Role Counts for Summary
    const totalRoles = service.sections?.reduce((acc: number, s: any) => acc + (s.filledRoles?.length || 0), 0) || 0;
    const assignedRoles = service.sections?.reduce((acc: number, s: any) => acc + (s.filledRoles?.filter((r: any) => !!r.assignedPerson).length || 0), 0) || 0;

    return (
        <PageContainer
            title="Detalle del Culto"
            description={format(new Date(service.date), "EEEE d 'de' MMMM, yyyy - HH:mm 'hs'", { locale: es })}
            backButton={true}
            headerAction={
                <div className="flex gap-2 items-center">
                    <Badge variant="outline" className={`text-sm px-3 py-1 uppercase tracking-widest ${service.status === 'CONFIRMED' ? 'border-green-200 text-green-700 bg-green-50' : 'border-indigo-200 text-indigo-700 bg-indigo-50'}`}>
                        {service.status === 'DRAFT' ? 'Borrador' : service.status === 'CONFIRMED' ? 'Confirmado' : service.status}
                    </Badge>

                    {service.status === 'CONFIRMED' && (
                        <PDFDownloadLink
                            document={<WorshipServicePDF service={service} />}
                            fileName={`culto-${format(new Date(service.date), 'yyyy-MM-dd')}.pdf`}
                            className="inline-flex h-9 items-center justify-center rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            {/* @ts-ignore - loading instance is internal to PDFDownloadLink children function but we use simple text */}
                            <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-red-500" />
                                <span>Descargar PDF</span>
                            </div>
                        </PDFDownloadLink>
                    )}

                    <Button variant="outline" size="sm" onClick={() => setIsEditOpen(true)}>
                        <Pencil className="w-4 h-4 mr-2" />
                        Editar Info
                    </Button>
                </div>
            }
        >
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Timeline */}
                <div className="lg:col-span-2 space-y-6">
                    {/* General Staff Card (Grouped by Ministry) */}
                    {(() => {
                        const standardRolesByMinistry: Record<string, any[]> = {};

                        service.sections?.forEach((s: any) => {
                            if (s.filledRoles) {
                                s.filledRoles.forEach((r: any) => {
                                    // Filter: STANDARD roles OR ANY role in a GLOBAL section
                                    if (r.role.behaviorType === 'STANDARD' || s.type === 'GLOBAL') {
                                        const ministryName = r.role.ministry?.name || 'General';
                                        if (!standardRolesByMinistry[ministryName]) {
                                            standardRolesByMinistry[ministryName] = [];
                                        }
                                        // Deduplicate
                                        const exists = standardRolesByMinistry[ministryName].some(
                                            ex => ex.role.id === r.role.id && ex.assignedPerson?.id === r.assignedPerson?.id
                                        );
                                        if (!exists) {
                                            standardRolesByMinistry[ministryName].push(r);
                                        }
                                    }
                                });
                            }
                        });

                        const ministries = Object.keys(standardRolesByMinistry);
                        if (ministries.length === 0) return null;

                        return (
                            <Card className="border-none shadow-sm ring-1 ring-slate-200/60 bg-slate-50/50">
                                <CardHeader className="pb-3 border-b border-slate-100/50 mb-2">
                                    <div className="flex items-center gap-2">
                                        <Users className="w-5 h-5 text-indigo-600" />
                                        <CardTitle className="text-lg font-bold text-slate-800">Equipo de Servicio General</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {ministries.map(ministryName => (
                                        <div key={ministryName}>
                                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                <span className="w-1 h-1 rounded-full bg-slate-400" />
                                                {ministryName}
                                            </h4>
                                            <div className="grid sm:grid-cols-2 gap-3">
                                                {standardRolesByMinistry[ministryName].map((roleInfo, idx) => (
                                                    <div key={idx} className="flex items-center gap-3 p-2 rounded-lg bg-white border border-slate-100 shadow-sm">
                                                        <Avatar className="w-8 h-8 rounded-lg shrink-0">
                                                            {roleInfo.assignedPerson?.avatarUrl ? (
                                                                <AvatarImage src={roleInfo.assignedPerson.avatarUrl} />
                                                            ) : (
                                                                <AvatarFallback className={`${roleInfo.assignedPerson ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-400'}`}>
                                                                    {roleInfo.assignedPerson ? (roleInfo.assignedPerson.firstName?.[0] || 'U') : '?'}
                                                                </AvatarFallback>
                                                            )}
                                                        </Avatar>
                                                        <div className="overflow-hidden flex-1">
                                                            <div className="flex items-center gap-2">
                                                                <p className="text-xs text-slate-500 font-bold uppercase truncate">{roleInfo.role.name}</p>
                                                            </div>
                                                            {roleInfo.assignedPerson ? (
                                                                <p className="text-sm font-bold text-slate-900 truncate">{roleInfo.assignedPerson.firstName} {roleInfo.assignedPerson.lastName}</p>
                                                            ) : (
                                                                <p className="text-sm font-medium text-slate-400 italic">Sin asignar</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        );
                    })()}

                    <div className="relative border-l-2 border-indigo-100 ml-6 space-y-10 py-4">
                        {(() => {
                            const renderedElements: React.ReactNode[] = [];
                            const timelineSections = service.sections?.filter((s: any) => s.type !== 'GLOBAL') || [];

                            // Initialize with service start time
                            let currentOffset = 0;

                            timelineSections.forEach((section: any, idx: number) => {
                                const timelineRoles = section.filledRoles?.filter((r: any) => {
                                    return r.role.behaviorType !== 'STANDARD';
                                }) || [];

                                const hasMusicLeader = timelineRoles.some((r: any) => r.role.behaviorType === 'MUSIC_LEADER');

                                renderedElements.push(
                                    <div key={section.id} className="relative pl-8 group">
                                        <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-indigo-500 bg-white group-hover:bg-indigo-500 transition-colors shadow-sm" />

                                        <Card className="border-none shadow-sm ring-1 ring-slate-200/60 hover:ring-indigo-200 transition-all">
                                            <CardContent className="p-5">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                                                                {format(new Date(new Date(service.date).getTime() + (currentOffset * 60000)), 'HH:mm')}
                                                            </span>
                                                            <Badge variant="secondary" className="text-[10px] font-bold">{section.duration || 15} min</Badge>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <h3 className="text-xl font-bold text-slate-800">{section.title}</h3>
                                                            {/* Edit Content Button - ONLY for Music Leader sections */}
                                                            {hasMusicLeader && (
                                                                <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5 text-indigo-600 border-indigo-100 hover:bg-indigo-50" onClick={() => setEditingSectionId(section.id)}>
                                                                    <Pencil className="w-3 h-3" />
                                                                    {section.content ? 'Editar Contenido' : 'Añadir Canción / Nota'}
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    {/* Section Content Display */}
                                                    {section.content && (
                                                        <div className="bg-indigo-50/50 rounded-lg p-3 border border-indigo-50 mb-2">
                                                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                                                                <Music className="w-3 h-3" />
                                                                Repertorio / Contenido
                                                            </p>
                                                            <ul className="text-sm text-indigo-900 space-y-1 font-medium">
                                                                {section.content.split('\n').map((line: string, i: number) => (
                                                                    <li key={i} className="flex items-start gap-2">
                                                                        <span className="opacity-40 select-none text-xs translate-y-0.5">{i + 1}.</span>
                                                                        {line}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}

                                                    {/* Roles */}
                                                    {timelineRoles.length > 0 ? (
                                                        <div className="grid sm:grid-cols-2 gap-3">
                                                            {timelineRoles.map((roleInfo: any, rIdx: number) => {
                                                                const isMusicLeader = roleInfo.role.behaviorType === 'MUSIC_LEADER';
                                                                const isSpeaker = roleInfo.role.behaviorType === 'SPEAKER';
                                                                const isAnnouncements = roleInfo.role.behaviorType === 'ANNOUNCEMENTS';

                                                                return (
                                                                    <div key={rIdx} className={`flex flex-col gap-2 p-3 rounded-xl border transition-all ${isMusicLeader ? 'bg-indigo-50/30 border-indigo-100 ring-1 ring-indigo-50 shadow-sm' :
                                                                        isSpeaker ? 'bg-purple-50/30 border-purple-100 ring-1 ring-purple-50' :
                                                                            isAnnouncements ? 'bg-amber-50/30 border-amber-100 ring-1 ring-amber-50' :
                                                                                'bg-white border-slate-100'
                                                                        }`}>
                                                                        <div className="flex items-center gap-3">
                                                                            <Avatar className="w-8 h-8 rounded-lg shrink-0">
                                                                                {roleInfo.assignedPerson?.avatarUrl ? (
                                                                                    <AvatarImage src={roleInfo.assignedPerson.avatarUrl} />
                                                                                ) : (
                                                                                    <AvatarFallback className={`${roleInfo.assignedPerson ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-400'}`}>
                                                                                        {roleInfo.assignedPerson ? (roleInfo.assignedPerson.firstName?.[0] || 'U') : '?'}
                                                                                    </AvatarFallback>
                                                                                )}
                                                                            </Avatar>
                                                                            <div className="overflow-hidden flex-1">
                                                                                <div className="flex items-center gap-2">
                                                                                    <p className="text-xs text-slate-500 font-bold uppercase truncate">{roleInfo.role.name}</p>
                                                                                    {isMusicLeader && <Badge variant="secondary" className="text-[9px] h-4 px-1 bg-indigo-100 text-indigo-600 border-indigo-200">Líder</Badge>}
                                                                                </div>
                                                                                {roleInfo.assignedPerson ? (
                                                                                    <p className="text-sm font-bold text-slate-900 truncate">{roleInfo.assignedPerson.firstName} {roleInfo.assignedPerson.lastName}</p>
                                                                                ) : (
                                                                                    <p className="text-sm font-medium text-slate-400 italic">Sin asignar</p>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                        {(roleInfo.metadata?.title || roleInfo.metadata?.passage) && (
                                                                            <div className="mt-1 pt-2 border-t border-slate-100 pl-11">
                                                                                {roleInfo.metadata.title && (
                                                                                    isAnnouncements ? (
                                                                                        <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">{roleInfo.metadata.title}</p>
                                                                                    ) : (
                                                                                        <p className="text-sm font-bold text-indigo-900 leading-tight">"{roleInfo.metadata.title}"</p>
                                                                                    )
                                                                                )}
                                                                                {roleInfo.metadata.passage && <span className="text-xs text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded inline-block mt-1">{roleInfo.metadata.passage}</span>}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    ) : (
                                                        <p className="text-xs text-slate-400 italic pl-1">Sin requerimientos de plataforma.</p>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                );

                                // Increment offset for NEXT section
                                currentOffset += (section.duration || 15);
                            });

                            return renderedElements;
                        })()}
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-slate-200/50">
                        <CardHeader>
                            <CardTitle className="text-base font-bold">Resumen de Personal</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-500">Voluntarios Programados</span>
                                        <span className="font-bold text-indigo-600">{assignedRoles} / {totalRoles}</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-500 transition-all" style={{ width: `${totalRoles > 0 ? (assignedRoles / totalRoles) * 100 : 0}%` }} />
                                    </div>
                                </div>
                                <p className="text-xs text-slate-400 italic">
                                    {totalRoles - assignedRoles} posiciones aún sin asignar.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="p-4 bg-indigo-900 rounded-2xl text-white">
                        <h4 className="font-bold mb-2">Estado del Culto</h4>
                        <p className="text-xs text-indigo-200 mb-4 opacity-80">
                            Asegúrate de que todas las posiciones críticas estén cubiertas antes de confirmar el servicio.
                        </p>
                        <Button
                            className={`w-full font-bold ${service.status === 'CONFIRMED' ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-white text-indigo-900 hover:bg-indigo-50'}`}
                            onClick={handleConfirmService}
                            disabled={service.status === 'CONFIRMED'}
                        >
                            {service.status === 'CONFIRMED' ? (
                                <>
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Culto Confirmado
                                </>
                            ) : (
                                'Confirmar Culto'
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Edit DIALOG */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Información del Culto</DialogTitle>
                        <DialogDescription>Modifica la fecha, hora o el tema principal.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdateService} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Fecha y Hora</Label>
                            {service && <Input type="datetime-local" name="date" required defaultValue={getDefaultDateValue(service.date)} />}
                        </div>
                        <div className="space-y-2">
                            <Label>Esquema de Reunion (Opcional)</Label>
                            <Input name="topic" placeholder="Ej: La Fe que Mueve Montañas" defaultValue={service?.topic} />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>Cancelar</Button>
                            <Button type="submit" disabled={isEditing} className="bg-indigo-600 hover:bg-indigo-700">
                                {isEditing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Guardar Cambios
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Section Content Dialog */}
            <Dialog open={!!editingSectionId} onOpenChange={(open) => !open && setEditingSectionId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Contenido</DialogTitle>
                        <DialogDescription>Agrega la lista de canciones o notas para esta sección.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdateSectionContent} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Contenido (Canciones, Notas, Lectura)</Label>
                            <textarea
                                name="content"
                                className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                defaultValue={service.sections?.find((s: any) => s.id === editingSectionId)?.content || ''}
                                placeholder="Escribe aquí..."
                            />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setEditingSectionId(null)}>Cancelar</Button>
                            <Button type="submit">Guardar</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </PageContainer>
    );
}
