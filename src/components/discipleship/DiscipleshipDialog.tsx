import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm, Controller } from 'react-hook-form';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Search, Loader2, X, GraduationCap, User } from 'lucide-react';
import { DiscipleshipRole, DiscipleshipStatus } from '@/types/discipleship';
import { Textarea } from '@/components/ui/textarea';

interface DiscipleshipDialogProps {
    discipleshipId?: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

function MemberSearch({ onSelect, excludeIds = [] }: { onSelect: (member: any) => void, excludeIds?: string[] }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [searching, setSearching] = useState(false);

    const search = async (q: string) => {
        setQuery(q);
        if (q.length < 2) {
            setResults([]);
            return;
        }
        setSearching(true);
        try {
            const res = await api.get('/members');
            const filtered = res.data.filter((m: any) =>
                (m.person?.fullName?.toLowerCase().includes(q.toLowerCase()) ||
                    m.person?.email?.toLowerCase().includes(q.toLowerCase())) &&
                !excludeIds.includes(m.id)
            ).slice(0, 5);
            setResults(filtered);
        } catch (e) {
            console.error(e);
        } finally {
            setSearching(false);
        }
    };

    return (
        <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <Input
                placeholder="Buscar por nombre..."
                className="pl-9"
                value={query}
                onChange={(e) => search(e.target.value)}
            />
            {results.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto">
                    {results.map(r => (
                        <div key={r.id} className="p-2 hover:bg-slate-50 cursor-pointer flex items-center justify-between"
                            onClick={() => {
                                onSelect(r);
                                setQuery('');
                                setResults([]);
                            }}>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium">{r.person?.fullName}</span>
                                <span className="text-xs text-gray-500">{r.email}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export function DiscipleshipDialog({ discipleshipId, open, onOpenChange, onSuccess }: DiscipleshipDialogProps) {
    const isEdit = !!discipleshipId;
    const { register, control, handleSubmit, setValue, watch, reset } = useForm({
        defaultValues: {
            name: '',
            objective: '',
            studyMaterial: '',
            startDate: new Date().toISOString().split('T')[0],
            status: DiscipleshipStatus.ACTIVE,
            disciplers: [] as any[],
            disciples: [] as any[]
        }
    });

    const [isLoading, setIsLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(false);

    const disciplers = watch('disciplers');
    const disciples = watch('disciples');

    useEffect(() => {
        if (open) {
            if (isEdit) {
                loadData();
            } else {
                reset({
                    name: '',
                    objective: '',
                    studyMaterial: '',
                    startDate: new Date().toISOString().split('T')[0],
                    status: DiscipleshipStatus.ACTIVE,
                    disciplers: [],
                    disciples: []
                });
            }
        }
    }, [open, discipleshipId]);

    const loadData = async () => {
        setFetchingData(true);
        try {
            const res = await api.get(`/discipleships/${discipleshipId}`);
            const data = res.data;

            const disciplerParts = data.participants.filter((p: any) => p.role === DiscipleshipRole.DISCIPLER);
            const discipleParts = data.participants.filter((p: any) => p.role === DiscipleshipRole.DISCIPLE);

            reset({
                name: data.name || '',
                objective: data.objective || '',
                studyMaterial: data.studyMaterial || '',
                startDate: data.startDate ? data.startDate.split('T')[0] : '',
                status: data.status,
                disciplers: disciplerParts.map((p: any) => p.member),
                disciples: discipleParts.map((p: any) => p.member)
            });
        } catch (error) {
            toast.error('Error al cargar datos');
            onOpenChange(false);
        } finally {
            setFetchingData(false);
        }
    };

    const onSubmit = async (data: any) => {
        setIsLoading(true);
        try {
            const payload = {
                name: data.name,
                objective: data.objective,
                studyMaterial: data.studyMaterial,
                startDate: data.startDate,
                status: isEdit ? data.status : undefined,
                participants: !isEdit ? [
                    ...data.disciplers.map((d: any) => ({ memberId: d.id, role: DiscipleshipRole.DISCIPLER })),
                    ...data.disciples.map((d: any) => ({ memberId: d.id, role: DiscipleshipRole.DISCIPLE }))
                ] : undefined
            };

            if (isEdit) {
                await api.patch(`/discipleships/${discipleshipId}`, {
                    name: data.name,
                    objective: data.objective,
                    studyMaterial: data.studyMaterial,
                    startDate: data.startDate,
                    status: data.status
                });
                toast.success('Discipulado actualizado');
            } else {
                if (data.disciplers.length === 0) {
                    toast.error('Debes asignar al menos un Discipulador');
                    setIsLoading(false);
                    return;
                }
                if (data.disciples.length === 0) {
                    toast.error('Debes asignar al menos un Discípulo');
                    setIsLoading(false);
                    return;
                }
                await api.post('/discipleships', payload);
                toast.success('Discipulado creado exitosamente');
            }
            onSuccess();
            onOpenChange(false);
        } catch (error) {
            console.error(error);
            toast.error('Error al guardar');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-indigo-100 rounded-full">
                            <GraduationCap className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                            <DialogTitle>{isEdit ? 'Editar Discipulado' : 'Nuevo Discipulado'}</DialogTitle>
                            <DialogDescription>
                                {isEdit ? 'Modifica los detalles del proceso.' : 'Crea un nuevo proceso de crecimiento espiritual.'}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {fetchingData ? (
                    <div className="py-8 flex justify-center"><Loader2 className="animate-spin text-primary" /></div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Basic Info */}
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Nombre (Opcional)</Label>
                                    <Input {...register('name')} placeholder="Ej: Grupo de Crecimiento" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Fecha de Inicio</Label>
                                    <Input type="date" {...register('startDate')} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Objetivo del Proceso</Label>
                                <Textarea {...register('objective')} placeholder="Describe el propósito espiritual..." className="h-20" />
                            </div>

                            <div className="space-y-2">
                                <Label>Material de Estudio</Label>
                                <Input {...register('studyMaterial')} placeholder="Ej: Libro de Romanos, Curso Vida Nueva..." />
                            </div>

                            {isEdit && (
                                <div className="space-y-2">
                                    <Label>Estado</Label>
                                    <select {...register('status')} className="w-full text-sm border-gray-300 rounded-md p-2 border">
                                        <option value={DiscipleshipStatus.ACTIVE}>Activo</option>
                                        <option value={DiscipleshipStatus.PAUSED}>Pausado</option>
                                        <option value={DiscipleshipStatus.COMPLETED}>Completado</option>
                                    </select>
                                </div>
                            )}
                        </div>

                        {/* Participants Section */}
                        <div className="space-y-4 pt-4 border-t">
                            <h4 className="font-medium text-sm text-gray-700">Participantes</h4>

                            {/* Disciplers - Now Multiple */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label className="text-indigo-600 font-semibold">Discipuladores (Quiénes enseñan)</Label>
                                    <span className="text-xs text-gray-400">{disciplers.length} asignados</span>
                                </div>

                                <div className="space-y-2">
                                    {(disciplers || []).map((d: any, idx: number) => (
                                        <div key={d.id} className="flex items-center justify-between p-2 bg-indigo-50 border border-indigo-100 rounded-md">
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4 text-indigo-500" />
                                                <span className="text-sm font-medium">{d.person?.fullName}</span>
                                            </div>
                                            {!isEdit && (
                                                <Button type="button" variant="ghost" size="sm" onClick={() => {
                                                    const newDisciplers = [...disciplers];
                                                    newDisciplers.splice(idx, 1);
                                                    setValue('disciplers', newDisciplers);
                                                }}>
                                                    <X className="w-4 h-4 text-gray-400" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}

                                    {!isEdit && (
                                        <MemberSearch
                                            onSelect={(m) => setValue('disciplers', [...disciplers, m])}
                                            excludeIds={[...disciplers.map((d: any) => d.id), ...disciples.map((d: any) => d.id)].filter(Boolean)}
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Disciples */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label className="text-pink-600 font-semibold">Discípulos (Quiénes aprenden)</Label>
                                    <span className="text-xs text-gray-400">{disciples.length} asignados</span>
                                </div>

                                <div className="space-y-2">
                                    {(disciples || []).map((d: any, idx: number) => (
                                        <div key={d.id} className="flex items-center justify-between p-2 bg-pink-50 border border-pink-100 rounded-md">
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4 text-pink-500" />
                                                <span className="text-sm font-medium">{d.person?.fullName}</span>
                                            </div>
                                            {!isEdit && (
                                                <Button type="button" variant="ghost" size="sm" onClick={() => {
                                                    const newDisciples = [...disciples];
                                                    newDisciples.splice(idx, 1);
                                                    setValue('disciples', newDisciples);
                                                }}>
                                                    <X className="w-4 h-4 text-gray-400" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}

                                    {!isEdit && (
                                        <MemberSearch
                                            onSelect={(m) => setValue('disciples', [...disciples, m])}
                                            excludeIds={[...disciplers.map((d: any) => d.id), ...disciples.map((d: any) => d.id)].filter(Boolean)}
                                        />
                                    )}
                                </div>
                            </div>

                            {isEdit && <p className="text-xs text-gray-400 italic">Para modificar participantes, gestiónalo desde la vista de detalle.</p>}
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
                            <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90">
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                {isEdit ? 'Guardar Cambios' : 'Iniciar Discipulado'}
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
