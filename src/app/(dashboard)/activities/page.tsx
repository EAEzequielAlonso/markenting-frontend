'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Search, Map, Users, Calendar, Flag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import PageContainer from '@/components/ui/PageContainer';
import useSWR from 'swr';
import api from '@/lib/api';
// Reuse CourseDialog
import CourseDialog from '@/components/courses/CourseDialog';

export default function ActivitiesPage() {
    const router = useRouter();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    // Fetch courses with type=ACTIVITY
    const { data: activities, mutate } = useSWR('/courses?type=ACTIVITY', async (url) => (await api.get(url)).data);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ACTIVE': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'COMPLETED': return 'bg-slate-100 text-slate-700 border-slate-200';
            case 'DRAFT': return 'bg-amber-100 text-amber-700 border-amber-200';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <PageContainer title="Actividades Comunitarias" description="Gestión de eventos, salidas y vida en comunidad">
            <div className="flex justify-between items-center mb-6">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                        type="search"
                        placeholder="Buscar actividad..."
                        className="pl-9 bg-white"
                    />
                </div>
                <Button onClick={() => setIsDialogOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200">
                    <Plus className="w-4 h-4 mr-2" />
                    Nueva Actividad
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activities?.map((activity: any) => (
                    <Card
                        key={activity.id}
                        className="group hover:shadow-lg transition-all duration-300 border-t-4 cursor-pointer overflow-hidden"
                        style={{ borderTopColor: activity.color || '#10b981' }}
                        // Redirect to course details (using same route or different?
                        // If I use unified backend, the ID is valid for /courses/:id
                        // BUT I might want to keep /activities/:id in frontend for UX?
                        // OPTION A: Redirect to /courses/:id and let CourseDetailPage handle the view.
                        // OPTION B: Keep /activities/:id and duplicate logic? (No, unnecessary).
                        // OPTION C: Redirect to /activities/:id and mapped to same implementation.
                        // Let's use /courses/:id for simplicity first, or check if I updated app/(dashboard)/activities/[id]/page.tsx
                        // I will UPDATE app/(dashboard)/activities/[id]/page.tsx to be a re-export or copy of CourseDetailPage with "isActivity" prop?
                        // Or just reuse standard logic.
                        // Wait, if I redirect to /activities/:id, I need that page to work.
                        // I will update /activities/[id]/page.tsx next.
                        onClick={() => router.push(`/activities/${activity.id}`)}
                    >
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <div>
                                    <Badge variant="outline" className={`mb-2 font-bold ${getStatusColor(activity.status)}`}>
                                        {activity.status}
                                    </Badge>
                                    <CardTitle className="text-xl font-bold text-slate-800 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                                        {activity.title}
                                        {/* Note: It's 'title' now, not 'name', because it's a Course entity */}
                                    </CardTitle>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <p className="text-sm text-slate-500 line-clamp-2 min-h-[40px]">
                                    {activity.description || 'Sin descripción disponible.'}
                                </p>

                                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                                        <span>
                                            {activity.startDate
                                                ? format(new Date(activity.startDate + 'T12:00:00'), "d MMM yyyy", { locale: es })
                                                : 'Sin fecha'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users className="w-3.5 h-3.5 text-emerald-500" />
                                        <span>{activity.participants?.length || 0} participantes</span>
                                    </div>
                                    {activity.category && (
                                        <div className="flex items-center gap-2 col-span-2">
                                            <Flag className="w-3.5 h-3.5 text-emerald-500" />
                                            <span className="uppercase tracking-wider font-bold text-[10px]">{activity.category}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                        <div className="h-1 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent w-0 group-hover:w-full transition-all duration-700" />
                    </Card>
                ))}

                {(!activities || activities.length === 0) && (
                    <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                        <Map className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-700">No hay actividades activas</h3>
                        <p className="text-slate-500 mb-6 max-w-md mx-auto">Comienza creando una salida, evento o jornada comunitaria para la iglesia.</p>
                        <Button variant="outline" onClick={() => setIsDialogOpen(true)} className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                            Crear mi primera actividad
                        </Button>
                    </div>
                )}
            </div>

            <CourseDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onSuccess={() => mutate()}
                defaultType="ACTIVITY" // Pass defaultType
            />
        </PageContainer>
    );
}
