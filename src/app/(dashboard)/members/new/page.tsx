'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

export default function NewMemberPage() {
    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
                <Link href="/members">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Nuevo Miembro</h1>
                    <p className="text-gray-500 text-sm">Registra un nuevo miembro en la base de datos</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Nombre Completo</label>
                        <Input placeholder="Ej. Juan Pérez" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email</label>
                        <Input type="email" placeholder="juan@example.com" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Teléfono</label>
                        <Input placeholder="+1 234 567 890" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Fecha de Nacimiento</label>
                        <Input type="date" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Dirección</label>
                    <Input placeholder="Calle Principal 123, Ciudad" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Rol</label>
                        <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                            <option value="MEMBER">Miembro</option>
                            <option value="LEADER">Líder</option>
                            <option value="PASTOR">Pastor</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Estado</label>
                        <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                            <option value="ACTIVE">Activo</option>
                            <option value="PENDING">Pendiente</option>
                            <option value="INACTIVE">Inactivo</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-end gap-4 pt-4 border-t">
                    <Button variant="outline">Cancelar</Button>
                    <Button className="bg-primary hover:bg-primary/90">
                        <Save className="w-4 h-4 mr-2" />
                        Guardar Miembro
                    </Button>
                </div>
            </div>
        </div>
    );
}
