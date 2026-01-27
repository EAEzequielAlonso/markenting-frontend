import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Search, Plus, Trash2, User, AlertCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MembershipStatus } from '@/types/auth-types';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface FamilyDialogProps {
    familyId?: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

function MemberSearchSelect({ onSelect, label, excludeIds = [] }: { onSelect: (member: any) => void, label: string, excludeIds?: string[] }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);

    const search = async (q: string) => {
        setQuery(q);
        if (q.length < 2) {
            setResults([]);
            return;
        }
        try {
            const res = await api.get('/members');
            const filtered = res.data.filter((m: any) =>
                (m.person?.fullName?.toLowerCase().includes(q.toLowerCase()) ||
                    m.person?.email?.toLowerCase().includes(q.toLowerCase())) &&
                !excludeIds.includes(m.id)
            ).slice(0, 5);
            setResults(filtered);
        } catch (e) { console.error(e); }
    };

    return (
        <div className="space-y-2">
            <Label>{label}</Label>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                    placeholder="Buscar miembro existente..."
                    className="pl-10"
                    value={query}
                    onChange={(e) => search(e.target.value)}
                />
            </div>
            {results.length > 0 && (
                <div className="border rounded-md mt-1 bg-white shadow-sm max-h-40 overflow-y-auto">
                    {results.map(r => (
                        <div key={r.id} className="p-2 hover:bg-gray-50 cursor-pointer text-sm flex items-center justify-between"
                            onClick={() => {
                                onSelect(r);
                                setQuery('');
                                setResults([]);
                            }}>
                            <span>{r.person?.fullName}</span>
                            <span className="text-xs text-gray-500">{r.status}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function NewMemberForm({ register, prefix, roleLabel }: { register: any, prefix: string, roleLabel: string }) {
    return (
        <div className="p-4 border rounded-md bg-gray-50 space-y-3 mt-2">
            <h4 className="text-sm font-medium text-gray-700">Nuevo {roleLabel}</h4>
            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                    <Label className="text-xs">Nombre</Label>
                    <Input {...register(`${prefix}.firstName`)} className="h-8 text-sm" placeholder="Nombre" />
                </div>
                <div className="space-y-1">
                    <Label className="text-xs">Apellido</Label>
                    <Input {...register(`${prefix}.lastName`)} className="h-8 text-sm" placeholder="Apellido" />
                </div>
                <div className="space-y-1">
                    <Label className="text-xs">Fecha Nac.</Label>
                    <Input type="date" {...register(`${prefix}.birthDate`)} className="h-8 text-sm" />
                </div>
                <div className="space-y-1">
                    <Label className="text-xs">DNI (Opcional)</Label>
                    <Input {...register(`${prefix}.documentId`)} className="h-8 text-sm" />
                </div>
            </div>
        </div>
    )
}

export function FamilyDialog({ familyId, open, onOpenChange, onSuccess }: FamilyDialogProps) {
    const isEdit = !!familyId;
    const { register, control, handleSubmit, setValue, watch, reset } = useForm({
        defaultValues: {
            name: '',
            fatherId: '',
            fatherNew: null as any,
            motherId: '',
            motherNew: null as any,
            children: [] as any[]
        }
    });

    const [fatherSelected, setFatherSelected] = useState<any>(null);
    const [motherSelected, setMotherSelected] = useState<any>(null);
    const [createFather, setCreateFather] = useState(false);
    const [createMother, setCreateMother] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(false);

    const { fields: childFields, append: appendChild, remove: removeChild } = useFieldArray({
        control,
        name: 'children'
    });

    useEffect(() => {
        if (open) {
            if (isEdit) {
                loadFamilyData();
            } else {
                reset();
                setFatherSelected(null);
                setMotherSelected(null);
                setCreateFather(false);
                setCreateMother(false);
            }
        }
    }, [open, familyId]);

    const loadFamilyData = async () => {
        setFetchingData(true);
        try {
            const res = await api.get(`/families/${familyId}`);
            const family = res.data;
            setValue('name', family.name);

            // Map members
            const father = family.members.find((m: any) => m.role === 'FATHER');
            const mother = family.members.find((m: any) => m.role === 'MOTHER');
            const children = family.members.filter((m: any) => m.role === 'CHILD');

            if (father) {
                setFatherSelected(father.member);
                setValue('fatherId', father.member.id);
            } else {
                setFatherSelected(null);
                setValue('fatherId', '');
            }

            if (mother) {
                setMotherSelected(mother.member);
                setValue('motherId', mother.member.id);
            } else {
                setMotherSelected(null);
                setValue('motherId', '');
            }

            // For children in edit mode, we store their relationship ID to potentially delete/update
            // But for simplicity in this MVP, we re-sync on Save OR handle child updates separately.
            // Let's allow updating child names directly if they are profiles without users.
            reset({
                name: family.name,
                fatherId: father?.member.id || '',
                motherId: mother?.member.id || '',
                children: children.map((c: any) => ({
                    id: c.id, // relationship ID
                    memberId: c.member.id, // member profile ID
                    firstName: c.member.person.firstName,
                    lastName: c.member.person.lastName,
                    birthDate: c.member.person.birthDate ? c.member.person.birthDate.split('T')[0] : ''
                }))
            });

        } catch (e) {
            toast.error('Error al cargar datos de la familia');
        } finally {
            setFetchingData(false);
        }
    };

    const onSubmit = async (data: any) => {
        setIsLoading(true);
        try {
            // 1. Update/Create Family basic info (Name)
            if (isEdit) {
                await api.patch(`/families/${familyId}`, { name: data.name });

                // For Edit Mode, we need to handle Parent Changes
                // If fatherId changed or was removed/added
                // Backend needs to support updating members or we do it here

                // Let's do a simplified "Sync" logic:
                // Removing old ones and adding new ones is safer for a quick MVP
                // or we use specific endpoints. 
                // Since I already implemented addMember/removeMember...

                // This logic is complex for a single button click. 
                // Let's assume the user wants the "Save" button to handle it all.

                // RE-SYNC EVERYTHING (Delete all members and re-add) - Bit heavy but reliable for MVP
                // Better: The user requested a "Unified interface".

                // Let's use a specialized sync endpoint if possible, but I'll stick to manual sync here.
                // Fetch current to see what to delete
                const currentRes = await api.get(`/families/${familyId}`);
                const currentMembers = currentRes.data.members;
                for (const m of currentMembers) {
                    await api.delete(`/families/${familyId}/members/${m.member.id}`);
                }
            }

            // 2. Add Members (Same for Create or re-syncing Edit)
            const membersPayload = [];

            // Father
            if (createFather && (data.fatherNew?.firstName || data.fatherNew?.lastName)) {
                membersPayload.push({ role: 'FATHER', newMember: { ...data.fatherNew, status: MembershipStatus.MEMBER } });
            } else if (data.fatherId) {
                membersPayload.push({ role: 'FATHER', memberId: data.fatherId });
            }

            // Mother
            if (createMother && (data.motherNew?.firstName || data.motherNew?.lastName)) {
                membersPayload.push({ role: 'MOTHER', newMember: { ...data.motherNew, status: MembershipStatus.MEMBER } });
            } else if (data.motherId) {
                membersPayload.push({ role: 'MOTHER', memberId: data.motherId });
            }

            // Children - Also update their profile data!
            for (const child of data.children) {
                if (child.memberId) {
                    // Update existing child profile data first
                    await api.patch(`/members/${child.memberId}`, {
                        firstName: child.firstName,
                        lastName: child.lastName,
                        birthDate: child.birthDate
                    });
                    membersPayload.push({ role: 'CHILD', memberId: child.memberId });
                } else if (child.firstName) {
                    membersPayload.push({
                        role: 'CHILD',
                        newMember: {
                            firstName: child.firstName,
                            lastName: child.lastName,
                            birthDate: child.birthDate,
                            status: MembershipStatus.CHILD
                        }
                    });
                }
            }

            if (!isEdit) {
                await api.post('/families', { name: data.name, members: membersPayload });
                toast.success('Familia creada exitosamente');
            } else {
                // Add all back
                for (const m of membersPayload) {
                    if (m.memberId) {
                        await api.post(`/families/${familyId}/members`, { memberId: m.memberId, role: m.role });
                    } else {
                        // Creating new ones during edit... 
                        // FamiliesService.create handles nested, but addMember doesn't. 
                        // I'll need to create member first or update addMember.
                        // For now, let's assume we create them via separate call.
                        const newMem = await api.post('/members', { ...m.newMember });
                        await api.post(`/families/${familyId}/members`, { memberId: newMem.data.id, role: m.role });
                    }
                }
                toast.success('Familia actualizada exitosamente');
            }

            onSuccess();
            onOpenChange(false);
        } catch (error: any) {
            console.error(error);
            toast.error('Error al procesar la familia');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isEdit ? 'Editar Familia' : 'Nueva Familia'}</DialogTitle>
                    <DialogDescription>
                        {isEdit ? 'Modifica los datos de la familia y sus integrantes.' : 'Crea una nueva familia asignando Padre, Madre e Hijos.'}
                    </DialogDescription>
                </DialogHeader>

                {fetchingData ? (
                    <div className="py-10 text-center text-gray-500">Cargando datos...</div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <Label>Nombre de la Familia</Label>
                            <Input {...register('name')} placeholder="Ej: Familia Pérez - González" required />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* FATHER SECTION */}
                            <div className="space-y-2 border p-3 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                    <Label className="font-bold text-primary">Padre</Label>
                                    <div className="space-x-2 text-xs">
                                        {!createFather && !fatherSelected && (
                                            <Button type="button" variant="link" size="sm" className="h-auto p-0" onClick={() => setCreateFather(true)}>
                                                Crear Nuevo
                                            </Button>
                                        )}
                                        {createFather && (
                                            <Button type="button" variant="link" size="sm" className="h-auto p-0 text-red-500" onClick={() => setCreateFather(false)}>
                                                Buscar Existente
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                {!createFather ? (
                                    fatherSelected ? (
                                        <div className="flex items-center justify-between p-2 bg-blue-50 rounded border border-blue-100">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-sm">{fatherSelected.person?.fullName}</span>
                                                <span className="text-xs text-gray-500">{fatherSelected.status}</span>
                                            </div>
                                            <Button type="button" variant="ghost" size="sm" onClick={() => { setFatherSelected(null); setValue('fatherId', ''); }}>
                                                <Trash2 className="w-4 h-4 text-red-400" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <MemberSearchSelect
                                            label=""
                                            onSelect={(m) => { setFatherSelected(m); setValue('fatherId', m.id); }}
                                            excludeIds={[motherSelected?.id].filter(Boolean)}
                                        />
                                    )
                                ) : (
                                    <NewMemberForm register={register} prefix="fatherNew" roleLabel="Padre" />
                                )}
                            </div>

                            {/* MOTHER SECTION */}
                            <div className="space-y-2 border p-3 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                    <Label className="font-bold text-pink-500">Madre</Label>
                                    <div className="space-x-2 text-xs">
                                        {!createMother && !motherSelected && (
                                            <Button type="button" variant="link" size="sm" className="h-auto p-0" onClick={() => setCreateMother(true)}>
                                                Crear Nueva
                                            </Button>
                                        )}
                                        {createMother && (
                                            <Button type="button" variant="link" size="sm" className="h-auto p-0 text-red-500" onClick={() => setCreateMother(false)}>
                                                Buscar Existente
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                {!createMother ? (
                                    motherSelected ? (
                                        <div className="flex items-center justify-between p-2 bg-pink-50 rounded border border-pink-100">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-sm">{motherSelected.person?.fullName}</span>
                                                <span className="text-xs text-gray-500">{motherSelected.status}</span>
                                            </div>
                                            <Button type="button" variant="ghost" size="sm" onClick={() => { setMotherSelected(null); setValue('motherId', ''); }}>
                                                <Trash2 className="w-4 h-4 text-red-400" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <MemberSearchSelect
                                            label=""
                                            onSelect={(m) => { setMotherSelected(m); setValue('motherId', m.id); }}
                                            excludeIds={[fatherSelected?.id].filter(Boolean)}
                                        />
                                    )
                                ) : (
                                    <NewMemberForm register={register} prefix="motherNew" roleLabel="Madre" />
                                )}
                            </div>
                        </div>

                        {/* CHILDREN SECTION */}
                        <div className="space-y-3 pt-4 border-t">
                            <div className="flex justify-between items-center">
                                <Label className="font-bold">Hijos</Label>
                                <Button type="button" variant="outline" size="sm" onClick={() => appendChild({ firstName: '', lastName: '', birthDate: '' })}>
                                    <Plus className="w-4 h-4 mr-2" /> Agregar Hijo
                                </Button>
                            </div>

                            <div className="space-y-2">
                                {childFields.map((field, index) => (
                                    <div key={field.id} className="flex gap-2 items-start bg-gray-50 p-2 rounded-md">
                                        <div className="grid grid-cols-3 gap-2 flex-1">
                                            <div className="space-y-1">
                                                <Label className="text-[10px] text-gray-400">Nombre</Label>
                                                <Input {...register(`children.${index}.firstName`)} placeholder="Nombre" className="h-8 text-sm" />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-[10px] text-gray-400">Apellido</Label>
                                                <Input {...register(`children.${index}.lastName`)} placeholder="Apellido" className="h-8 text-sm" />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-[10px] text-gray-400">Fec. Nac.</Label>
                                                <Input type="date" {...register(`children.${index}.birthDate`)} className="h-8 text-sm" />
                                            </div>
                                        </div>
                                        <Button type="button" variant="ghost" size="sm" className="mt-6" onClick={() => removeChild(index)}>
                                            <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                                        </Button>
                                    </div>
                                ))}
                                {childFields.length === 0 && (
                                    <p className="text-sm text-gray-400 italic text-center py-2">No hay hijos agregados aún.</p>
                                )}
                            </div>
                        </div>

                        <DialogFooter className="pt-4 border-t">
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90">
                                {isLoading ? 'Guardando...' : (isEdit ? 'Guardar Cambios' : 'Crear Familia')}
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
