'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import DiscipleshipHeader from './DiscipleshipHeader';
import MeetingsTab from './MeetingsTab';
import NotesTab from './NotesTab';
import TasksTab from './TasksTab';
import api from '@/lib/api';
import { toast } from 'sonner';
import { DiscipleshipStatus } from '@/types/discipleship';

export default function DiscipleshipDetailView({ discipleship, refresh, myRole, userId }: any) {

    const handleUpdateStatus = async (status: DiscipleshipStatus) => {
        try {
            await api.patch(`/discipleships/${discipleship.id}`, { status });
            toast.success('Estado actualizado');
            refresh();
        } catch (error) {
            toast.error('Error actualizando estado');
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <DiscipleshipHeader
                discipleship={discipleship}
                onUpdateStatus={handleUpdateStatus}
                myRole={myRole}
            />

            <Tabs defaultValue="meetings" className="space-y-4">
                <TabsList className="grid w-full md:w-auto grid-cols-3">
                    <TabsTrigger value="meetings">Encuentros</TabsTrigger>
                    <TabsTrigger value="notes">Bitácora y Notas</TabsTrigger>
                    <TabsTrigger value="tasks">Tareas</TabsTrigger>
                </TabsList>

                <TabsContent value="meetings" className="space-y-4">
                    <MeetingsTab discipleship={discipleship} refresh={refresh} myRole={myRole} />
                </TabsContent>

                <TabsContent value="notes" className="space-y-4">
                    <NotesTab discipleship={discipleship} refresh={refresh} myRole={myRole} userId={userId} />
                </TabsContent>

                <TabsContent value="tasks" className="space-y-4">
                    <TasksTab discipleship={discipleship} refresh={refresh} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
