import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import api from '@/lib/api';

export function AttendanceDialog({ open, onOpenChange, sessionId, courseId }: any) {
    const [participants, setParticipants] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [attendance, setAttendance] = useState<Record<string, boolean>>({});

    useEffect(() => {
        if (open && sessionId) {
            fetchData();
        }
    }, [open, sessionId]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            // Fetch course participants to know WHO should be there
            // And fetch existing attendance to pre-fill
            const [courseRes, attendanceRes] = await Promise.all([
                api.get(`/courses/${courseId}`), // We need participants list
                api.get(`/courses/sessions/${sessionId}/attendance`)
            ]);

            const allParticipants = [
                ...(courseRes.data.participants?.map((p: any) => ({ ...p, type: 'MEMBER', name: p.member.person.fullName })) || []),
                ...(courseRes.data.guests?.map((g: any) => ({ ...g, type: 'GUEST', name: g.fullName })) || [])
            ];

            setParticipants(allParticipants);

            const initialAttendance: Record<string, boolean> = {};
            // Default to FALSE for everyone, update if TRUE in DB
            allParticipants.forEach(p => initialAttendance[p.id] = false);

            attendanceRes.data.forEach((record: any) => {
                const targetId = record.participant?.id || record.guest?.id; // Note: record.participant is the OBJECT in relation
                // Wait, record.participant in DB is the Relation to CourseParticipant.
                // CourseParticipant ID is unique.
                if (record.participant) initialAttendance[record.participant.id] = record.present;
                if (record.guest) initialAttendance[record.guest.id] = record.present;
            });

            setAttendance(initialAttendance);

        } catch (error) {
            console.error(error);
            toast.error('Error cargando lista');
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggle = (id: string) => {
        setAttendance(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const payload = participants.map(p => ({
                participantId: p.type === 'MEMBER' ? p.id : undefined,
                guestId: p.type === 'GUEST' ? p.id : undefined,
                present: attendance[p.id] || false
            }));

            await api.post(`/courses/sessions/${sessionId}/attendance`, payload);
            toast.success('Asistencia guardada');
            onOpenChange(false);
        } catch (error) {
            toast.error('Error guardando asistencia');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Tomar Asistencia</DialogTitle>
                </DialogHeader>

                {isLoading ? (
                    <div className="py-8 text-center">Cargando...</div>
                ) : (
                    <div className="space-y-4 py-4">
                        {participants.length === 0 ? (
                            <div className="text-center text-gray-500">No hay participantes inscritos.</div>
                        ) : (
                            <div className="space-y-2">
                                {participants.map(p => (
                                    <div key={p.id} className="flex items-center space-x-3 p-2 hover:bg-slate-50 rounded border">
                                        <Checkbox
                                            id={p.id}
                                            checked={attendance[p.id] || false}
                                            onCheckedChange={() => handleToggle(p.id)}
                                        />
                                        <label htmlFor={p.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1">
                                            {p.name}
                                            <span className="text-xs text-gray-400 ml-2">({p.type === 'MEMBER' ? 'Miembro' : 'Invitado'})</span>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
                    <Button onClick={handleSave} disabled={isLoading}>Guardar Asistencia</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
