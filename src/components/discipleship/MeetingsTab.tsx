'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
// import { Dialog... } removed inline dialog imports
import MeetingDialog from './MeetingDialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, MapPin, Plus, Loader2, FileText } from 'lucide-react';
import { useForm } from 'react-hook-form';
import api from '@/lib/api';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { DiscipleshipRole } from '@/types/discipleship';
import { Pencil, Trash2, X } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Badge } from '../ui/badge';

export default function MeetingsTab({ discipleship, refresh, myRole }: any) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [meetingToEdit, setMeetingToEdit] = useState<any>(null);
    const [meetingToDelete, setMeetingToDelete] = useState<any>(null);
    const { register, handleSubmit, reset } = useForm();
    const canManage = myRole === DiscipleshipRole.SUPERVISOR || myRole === DiscipleshipRole.DISCIPLER;

    // Removed onAddMeeting function, logic moved to MeetingDialog
    const handleEdit = (meeting: any) => {
        setMeetingToEdit(meeting);
        setIsDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!meetingToDelete) return;
        try {
            await api.delete(`/discipleships/${discipleship.id}/meetings/${meetingToDelete.id}`);
            toast.success('Encuentro eliminado');
            refresh();
        } catch (error) {
            toast.error('Error al eliminar encuentro');
        } finally {
            setMeetingToDelete(null);
        }
    };

    const sortedMeetings = discipleship.meetings?.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()) || [];

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Encuentros</h3>
                {canManage && (
                    <Button onClick={() => { setMeetingToEdit(null); setIsDialogOpen(true); }} size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Registrar Encuentro
                    </Button>
                )}
            </div>

            {sortedMeetings.length === 0 ? (
                <div className="text-center py-10 border border-dashed rounded-lg bg-gray-50">
                    <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-gray-500">No hay encuentros registrados.</p>
                </div>
            ) : (
                <div className="relative border-l-2 ml-4 space-y-8 py-4 border-indigo-100">
                    {sortedMeetings.map((meeting: any, idx: number) => {
                        const isPast = new Date(meeting.date) < new Date();
                        return (
                            <div key={meeting.id} className="relative pl-8">
                                <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 ${isPast ? 'bg-slate-200 border-slate-300' : 'bg-white border-indigo-500'}`} />
                                <Card className={`hover:shadow-md transition-all ${isPast ? 'opacity-75 grayscale-[0.5]' : ''}`}>
                                    <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-start justify-between">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider h-5">Encuentro {sortedMeetings.length - idx}</Badge>
                                                {isPast && <Badge className="bg-slate-100 text-slate-600 hover:bg-slate-100 text-[10px] h-5">Realizado</Badge>}
                                                {meeting.type && (
                                                    <Badge variant="secondary" className="text-[10px] h-5 font-medium">
                                                        {meeting.type === 'VIRTUAL' ? 'Virtual' : 'Presencial'}
                                                    </Badge>
                                                )}
                                            </div>
                                            <h4 className="text-lg font-bold text-slate-800 leading-tight">
                                                {meeting.title || 'Encuentro sin título'}
                                            </h4>
                                            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mt-2">
                                                <div className="flex items-center gap-1.5 capitalize font-medium">
                                                    <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                                                    {format(new Date(meeting.date), "EEEE d 'de' MMMM", { locale: es })}
                                                </div>
                                                <div className="flex items-center gap-1.5 font-medium">
                                                    <Clock className="w-3.5 h-3.5 text-indigo-500" />
                                                    {format(new Date(meeting.date), "HH:mm")} hs ({meeting.durationMinutes} min)
                                                </div>
                                                {meeting.location && (
                                                    <div className="flex items-center gap-1.5 font-medium">
                                                        <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                                                        {meeting.location}
                                                    </div>
                                                )}
                                            </div>
                                            {meeting.summary && (
                                                <p className="text-sm text-slate-600 mt-3 bg-slate-50/80 p-3 rounded-lg border border-slate-100 leading-relaxed italic">
                                                    "{meeting.summary}"
                                                </p>
                                            )}
                                        </div>
                                        {canManage && (
                                            <div className="flex items-center gap-2 self-end md:self-start">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50" onClick={() => handleEdit(meeting)}>
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50" onClick={() => setMeetingToDelete(meeting)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        );
                    })}
                </div>
            )}

            <MeetingDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onSuccess={refresh}
                meetingToEdit={meetingToEdit}
                discipleshipId={discipleship.id}
            />

            <AlertDialog open={!!meetingToDelete} onOpenChange={() => setMeetingToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar encuentro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción eliminará el encuentro y el evento del calendario. No se puede deshacer.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white">Eliminar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
