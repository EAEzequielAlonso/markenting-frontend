'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { SmallGroupMember } from '@/types/small-group';
import { CalendarEvent } from '@/types/agenda';

interface TakeAttendanceDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    event: CalendarEvent;
    members: SmallGroupMember[];
    onSuccess: () => void;
}

export function TakeAttendanceDialog({ open, onOpenChange, event, members, onSuccess }: TakeAttendanceDialogProps) {
    // Initial state: Pre-select if they are already in event.attendees? 
    // Wait, event.attendees might not be fully populated in the list view if NOT fetched deep enough?
    // Assuming event has no attendees property in the type definition yet, need to check.
    // For now, let's assume we start empty or we need to fetch the event details again? 
    // Or we rely on what was passed.

    // For simplicity: We will just submit the selected IDs.
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Sync state when event changes or dialog opens
    useEffect(() => {
        if (open && event.attendees) {
            setSelectedIds(event.attendees.map(a => a.id));
        } else if (!open) {
            setSelectedIds([]);
        }
    }, [open, event.attendees, event.id]);

    const toggleMember = (personId: string) => {
        setSelectedIds(prev =>
            prev.includes(personId)
                ? prev.filter(id => id !== personId)
                : [...prev, personId]
        );
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/small-groups/events/${event.id}/attendance`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ personIds: selectedIds })
            });

            if (!res.ok) throw new Error('Error al guardar asistencia');

            toast.success('Asistencia guardada');
            onOpenChange(false);
            onSuccess();
        } catch (error) {
            toast.error('Ocurrió un error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Tomar Asistencia</DialogTitle>
                    <p className="text-sm text-slate-500">
                        {event.title} - {new Date(event.startDate).toLocaleDateString()}
                    </p>
                </DialogHeader>

                <div className="py-4 space-y-3 max-h-[300px] overflow-y-auto">
                    {members.map(member => (
                        <div key={member.id} className="flex items-center space-x-3 p-2 hover:bg-slate-50 rounded">
                            <Checkbox
                                id={member.id}
                                checked={member.member.person ? selectedIds.includes(member.member.person.id || '') : false}
                                onCheckedChange={() => member.member.person && toggleMember(member.member.person.id!)}
                            />
                            <Label htmlFor={member.id} className="cursor-pointer flex-grow font-normal">
                                {member.member.person?.firstName} {member.member.person?.lastName}
                            </Label>
                        </div>
                    ))}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
                    <Button onClick={handleSave} disabled={isLoading}>
                        {isLoading ? 'Guardando...' : 'Guardar Asistencia'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
