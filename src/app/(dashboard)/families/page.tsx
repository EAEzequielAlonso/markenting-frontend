'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Users, Pencil, Trash2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { FamilyDialog } from '@/components/families/FamilyDialog';
import api from '@/lib/api';
import { toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function FamiliesPage() {
    const { churchId } = useAuth();
    const [families, setFamilies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Dialog State
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedFamilyId, setSelectedFamilyId] = useState<string | null>(null);

    // Delete Alert State
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
    const [familyToDelete, setFamilyToDelete] = useState<any>(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const fetchFamilies = async () => {
        if (!churchId) return;
        setLoading(true);
        try {
            const res = await api.get('/families');
            setFamilies(res.data);
        } catch (error) {
            console.error('Failed to fetch families', error);
            toast.error('Error al cargar familias');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFamilies();
    }, [churchId]);

    const handleCreate = () => {
        setSelectedFamilyId(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (id: string) => {
        setSelectedFamilyId(id);
        setIsDialogOpen(true);
    };

    const confirmDelete = (family: any) => {
        setFamilyToDelete(family);
        setIsDeleteAlertOpen(true);
    };

    const handleDelete = async () => {
        if (!familyToDelete) return;
        try {
            await api.delete(`/families/${familyToDelete.id}`);
            toast.success('Familia eliminada correctamente');
            fetchFamilies();
        } catch (error) {
            toast.error('Error al eliminar la familia');
        } finally {
            setIsDeleteAlertOpen(false);
            setFamilyToDelete(null);
        }
    };

    const filteredFamilies = families.filter(f =>
        f.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginatedFamilies = filteredFamilies.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    return (
        <ErrorBoundary sectionName="Familias">
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Familias</h1>
                        <p className="text-gray-500 mt-1">Gestiona los núcleos familiares de tu iglesia</p>
                    </div>
                    <Button className="bg-primary hover:bg-primary/90" onClick={handleCreate}>
                        <Plus className="w-4 h-4 mr-2" />
                        Nueva Familia
                    </Button>
                </div>

                <FamilyDialog
                    familyId={selectedFamilyId}
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    onSuccess={fetchFamilies}
                />

                <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Esta acción eliminará el vínculo familiar de **{familyToDelete?.name}**.
                                Las personas asociadas **no serán eliminadas** del sistema.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                                Eliminar Familia
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Buscar por nombre de familia..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-700 font-medium border-b">
                                <tr>
                                    <th className="px-6 py-4">Nombre de Familia</th>
                                    <th className="px-6 py-4">Miembros</th>
                                    <th className="px-6 py-4">Creación</th>
                                    <th className="px-6 py-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-gray-500">Cargando...</td>
                                    </tr>
                                ) : paginatedFamilies.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No se encontraron familias.</td>
                                    </tr>
                                ) : paginatedFamilies.map((family) => (
                                    <tr key={family.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase">
                                                    <Users className="w-4 h-4" />
                                                </div>
                                                <span className="font-medium text-gray-900">{family.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col text-xs text-gray-600">
                                                {family.members?.length > 0 ? (
                                                    family.members.slice(0, 3).map((fm: any, idx: number) => (
                                                        <span key={idx}>
                                                            {fm.role === 'FATHER' && 'Padre: '}
                                                            {fm.role === 'MOTHER' && 'Madre: '}
                                                            {fm.role === 'CHILD' && 'Hijo/a: '}
                                                            {fm.member?.person?.fullName}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-gray-400">Sin miembros</span>
                                                )}
                                                {family.members?.length > 3 && (
                                                    <span className="text-gray-400 italic">... y {family.members.length - 3} más</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {family.createdAt ? new Date(family.createdAt).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleEdit(family.id)}
                                                    title="Editar"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => confirmDelete(family)}
                                                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination Controls */}
                    <div className="p-4 border-t bg-gray-50 text-xs text-gray-500 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <span>Filas por página:</span>
                            <select
                                className="border border-gray-300 rounded px-1 py-0.5 text-xs"
                                value={rowsPerPage}
                                onChange={(e) => {
                                    setRowsPerPage(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                            >
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                            </select>
                            <span className="ml-2">
                                Mostrando {Math.min((currentPage - 1) * rowsPerPage + 1, filteredFamilies.length)} - {Math.min(currentPage * rowsPerPage, filteredFamilies.length)} de {filteredFamilies.length}
                            </span>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                            >
                                Anterior
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(p => Math.min(Math.ceil(filteredFamilies.length / rowsPerPage), p + 1))}
                                disabled={currentPage >= Math.ceil(filteredFamilies.length / rowsPerPage)}
                            >
                                Siguiente
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    );
}
