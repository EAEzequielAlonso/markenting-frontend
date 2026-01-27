'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Search, BookOpen, Users, Calendar, MoreVertical } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import PageContainer from '@/components/ui/PageContainer';
import useSWR from 'swr';
import api from '@/lib/api';
import CourseDialog from '@/components/courses/CourseDialog';

export default function CoursesPage() {
    const router = useRouter();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { data: courses, mutate } = useSWR('/courses?type=COURSE', async (url) => (await api.get(url)).data);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ACTIVE': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'COMPLETED': return 'bg-slate-100 text-slate-700 border-slate-200';
            case 'DRAFT': return 'bg-amber-100 text-amber-700 border-amber-200';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'ACTIVE': return 'Activo';
            case 'COMPLETED': return 'Finalizado';
            case 'DRAFT': return 'Borrador';
            default: return status;
        }
    };

    return (
        <PageContainer title="Cursos y Talleres" description="Gestión de formación y capacitación">
            <div className="flex justify-between items-center mb-6">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                        type="search"
                        placeholder="Buscar curso..."
                        className="pl-9 bg-white"
                    />
                </div>
                <Button onClick={() => setIsDialogOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200">
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo Curso
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses?.map((course: any) => (
                    <Card
                        key={course.id}
                        className="group hover:shadow-lg transition-all duration-300 border-t-4 cursor-pointer overflow-hidden"
                        style={{ borderTopColor: course.color || '#6366f1' }}
                        onClick={() => router.push(`/courses/${course.id}`)}
                    >
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <div>
                                    <Badge variant="outline" className={`mb-2 font-bold ${getStatusColor(course.status)}`}>
                                        {getStatusLabel(course.status)}
                                    </Badge>
                                    <CardTitle className="text-xl font-bold text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                                        {course.title}
                                    </CardTitle>
                                </div>
                                {/* <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2"><MoreVertical className="w-4 h-4" /></Button> */}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <p className="text-sm text-slate-500 line-clamp-2 min-h-[40px]">
                                    {course.description || 'Sin descripción disponible.'}
                                </p>

                                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                                        <span>{format(new Date(course.startDate + 'T12:00:00'), "d MMM yyyy", { locale: es })}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users className="w-3.5 h-3.5 text-indigo-500" />
                                        <span>{course.participants?.length || 0} inscritos</span>
                                    </div>
                                    {course.category && (
                                        <div className="flex items-center gap-2 col-span-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                                            <span className="uppercase tracking-wider font-bold text-[10px]">{course.category}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                        <div className="h-1 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent w-0 group-hover:w-full transition-all duration-700" />
                    </Card>
                ))}

                {(!courses || courses.length === 0) && (
                    <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                        <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-700">No hay cursos activos</h3>
                        <p className="text-slate-500 mb-6 max-w-md mx-auto">Comienza creando un programa de formación, taller o escuela para tu congregación.</p>
                        <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
                            Crear mi primer curso
                        </Button>
                    </div>
                )}
            </div>

            <CourseDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onSuccess={() => mutate()}
                defaultType="COURSE"
            />
        </PageContainer>
    );
}
