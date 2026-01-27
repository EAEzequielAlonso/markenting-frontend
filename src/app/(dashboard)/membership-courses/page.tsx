'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

export default function MembershipCoursesPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[600px] space-y-4">
            <div className="p-4 bg-indigo-50 rounded-full">
                <BookOpen className="w-12 h-12 text-indigo-500 animate-pulse" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Cursos de Membresía</h1>
            <p className="text-slate-500 font-medium bg-slate-100 px-4 py-1.5 rounded-full text-sm uppercase tracking-widest">
                Próximamente
            </p>
            <p className="max-w-md text-center text-slate-400 text-sm leading-relaxed">
                Pronto podrás gestionar aquí los cursos de inducción y membresía para los nuevos integrantes de la iglesia.
            </p>
        </div>
    );
}
