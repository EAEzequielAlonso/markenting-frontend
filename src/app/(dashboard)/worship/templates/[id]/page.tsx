'use client';

import { use, useState } from 'react';
import PageContainer from '@/components/ui/PageContainer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Clock, Users, ArrowUp, ArrowDown } from 'lucide-react';
import useSWR from 'swr';
import api from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

export default function TemplateEditorPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
    const [selectedMinistry, setSelectedMinistry] = useState<string>('ALL');

    // Fetch Template
    const { data: template, isLoading, mutate } = useSWR(`/worship-services/templates/${id}`, async (url) => (await api.get(url)).data);

    // Fetch All Possible Duties (Roles) across ministries
    const { data: allDuties } = useSWR('/ministries/duties/all', async (url) => (await api.get(url)).data);

    const handleAddSection = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const payload = {
            title: formData.get('title'),
            defaultDuration: parseInt(formData.get('defaultDuration') as string),
            type: formData.get('type'), // optional enum or string
            order: (template.sections?.length || 0) + 1,
            ministryId: selectedMinistry === 'ALL' ? null : selectedMinistry,
            requiredRoleIds: selectedRoles
        };

        try {
            await api.post(`/worship-services/templates/${id}/sections`, payload);
            toast.success('Sección agregada');
            mutate();
            setIsAddSectionOpen(false);
            setSelectedRoles([]);
        } catch (error) {
            toast.error('Error al agregar sección');
        }
    };

    const handleDeleteSection = async (sectionId: string) => {
        if (!confirm('¿Eliminar esta sección?')) return;
        try {
            await api.delete(`/worship-services/templates/${id}/sections/${sectionId}`);
            toast.success('Sección eliminada');
            mutate();
        } catch (error) {
            toast.error('Error al eliminar');
        }
    };

    const toggleRoleSelection = (roleId: string) => {
        setSelectedRoles(prev =>
            prev.includes(roleId) ? prev.filter(id => id !== roleId) : [...prev, roleId]
        );
    };

    if (isLoading) return <PageContainer title="Cargando..." description=""><Skeleton className="w-full h-96" /></PageContainer>;
    if (!template) return <p>Plantilla no encontrada</p>;

    return (
        <PageContainer
            title={`Editor: ${template.name}`}
            description="Diseña la estructura base del culto."
            backButton={true}
        >
            <div className="flex justify-end mb-6">
                <Button onClick={() => setIsAddSectionOpen(true)} className="gap-2 bg-indigo-600 hover:bg-indigo-700">
                    <Plus className="w-4 h-4" />
                    Agregar Sección
                </Button>
            </div>

            <div className="space-y-4 max-w-3xl mx-auto">
                {template.sections?.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
                        <p className="text-slate-500 font-medium">Esta plantilla está vacía.</p>
                        <p className="text-sm text-slate-400">Agrega secciones como "Alabanza", "Predicación", etc.</p>
                    </div>
                )}

                {/* Global Sections (Non-Timeline) */}
                {(() => {
                    const globalSections = template.sections?.filter((s: any) => s.type === 'GLOBAL') || [];
                    if (globalSections.length === 0) return null;
                    return (
                        <div className="space-y-2 mb-6">
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider ml-1">Configuración Global</h3>
                            {globalSections.map((section: any) => (
                                <Card key={section.id} className="group border-l-4 border-l-indigo-500 bg-slate-50/50 hover:ring-1 hover:ring-indigo-100 transition-all">
                                    <CardContent className="p-4 flex items-center gap-4">
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-bold text-slate-800 text-lg">{section.title}</h4>
                                                    <Badge variant="secondary" className="text-[10px] bg-indigo-100 text-indigo-700">TODO EL CULTO</Badge>
                                                </div>
                                                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-500" onClick={() => handleDeleteSection(section.id)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                            <div className="flex items-center gap-4 mt-2">
                                                <div className="flex gap-1 flex-wrap">
                                                    {section.requiredRoles?.map((role: any) => (
                                                        <Badge key={role.id} variant="outline" className="text-[10px] bg-white text-slate-700 border-slate-200">
                                                            {role.name}
                                                        </Badge>
                                                    ))}
                                                    {(!section.requiredRoles || section.requiredRoles.length === 0) && (
                                                        <span className="text-xs text-slate-400 italic">Sin roles requeridos</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    );
                })()}

                {/* Timeline Sections */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider ml-1">Cronograma</h3>
                    {template.sections?.filter((s: any) => s.type !== 'GLOBAL').map((section: any, idx: number) => (
                        <Card key={section.id} className="group hover:ring-1 hover:ring-indigo-100 transition-all">
                            <CardContent className="p-4 flex items-center gap-4">
                                <div className="flex flex-col items-center justify-center w-8 text-slate-300 font-bold text-lg">
                                    {section.order} {/* We might need to re-calc render index if we exclude global, but order is persistent */}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold text-slate-800 text-lg">{section.title}</h4>
                                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-500" onClick={() => handleDeleteSection(section.id)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    <div className="flex items-center gap-4 mt-2">
                                        <div className="flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                                            <Clock className="w-3 h-3" />
                                            {section.defaultDuration} min
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {/* <Users className="w-3 h-3 text-slate-400" /> */}
                                            <div className="flex gap-1 flex-wrap">
                                                {section.requiredRoles?.map((role: any) => (
                                                    <Badge key={role.id} variant="outline" className="text-[10px] bg-indigo-50 text-indigo-600 border-indigo-100">
                                                        {role.name}
                                                    </Badge>
                                                ))}
                                                {(!section.requiredRoles || section.requiredRoles.length === 0) && (
                                                    <span className="text-xs text-slate-400 italic">Sin roles requeridos</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            <Dialog open={isAddSectionOpen} onOpenChange={setIsAddSectionOpen}>
                <DialogContent className="max-w-lg max-h-[90vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Agregar Sección</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddSection} className="space-y-4 py-2 overflow-y-auto flex-1 px-1">
                        <div className="space-y-2">
                            <Label>Título</Label>
                            <Input name="title" placeholder="Ej: Bienvenida, Alabanza..." required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Tipo</Label>
                                <Select name="type" defaultValue="GENERAL" onValueChange={(val) => {
                                    // Hack to force re-render if needed, but for now just let it be.
                                    // Ideally hide duration if GLOBAL.
                                }}>
                                    <SelectTrigger><SelectValue placeholder="General" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="GENERAL">General (Cronograma)</SelectItem>
                                        <SelectItem value="WORSHIP">Adoración</SelectItem>
                                        <SelectItem value="PREACHING">Predicación</SelectItem>
                                        <SelectItem value="GLOBAL">GLOBAL / TODO EL CULTO</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Duración (min)</Label>
                                    <Input name="defaultDuration" type="number" defaultValue="15" required />
                                </div>
                                <div className="space-y-2">
                                    <Label>Ministerio a Cargo (Opcional)</Label>
                                    <Select name="ministryId" onValueChange={(val) => setSelectedMinistry(val)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ALL">Sin asignar / General</SelectItem>
                                            {Array.from(new Set((allDuties || []).map((d: any) => d.ministry).filter(Boolean).map((m: any) => JSON.stringify({ id: m.id, name: m.name }))))
                                                .map((str: any) => {
                                                    const m = JSON.parse(str);
                                                    return <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>;
                                                })
                                            }
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Roles Requeridos {selectedMinistry !== 'ALL' && <span className="text-xs font-normal text-slate-500">(Filtrado por ministerio)</span>}</Label>

                                <div className="border border-slate-200 rounded-lg max-h-40 overflow-y-auto p-2 space-y-1">
                                    {allDuties
                                        ?.filter((d: any) => selectedMinistry === 'ALL' || d.ministry?.id === selectedMinistry)
                                        .map((duty: any) => (
                                            <div
                                                key={duty.id}
                                                className={`flex items-center justify-between p-2 rounded cursor-pointer text-sm ${selectedRoles.includes(duty.id) ? 'bg-indigo-50 text-indigo-700 font-bold' : 'hover:bg-slate-50 text-slate-600'}`}
                                                onClick={() => toggleRoleSelection(duty.id)}
                                            >
                                                <span>{duty.name}</span>
                                                <span className="text-[10px] text-slate-400 uppercase tracking-wider">{duty.ministry?.name}</span>
                                            </div>
                                        ))}
                                    {!allDuties?.length && <p className="text-xs text-slate-400 p-2">No hay roles configurados.</p>}
                                </div>
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsAddSectionOpen(false)}>Cancelar</Button>
                                <Button type="submit">Guardar</Button>
                            </DialogFooter>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </PageContainer>
    );
}
