import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';
import { MessageSquare, CheckCircle, Globe, Lock, Shield } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface PrayerRequestCardProps {
    request: any;
    onUpdate: () => void;
}

export function PrayerRequestCard({ request, onUpdate }: PrayerRequestCardProps) {
    const { token, churchId, user } = useAuth();
    const [isCommenting, setIsCommenting] = useState(false);
    const [newUpdate, setNewUpdate] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Can author actions?
    // Need to check if current user is the author. 
    // Assuming backend returns request.member.person.user.id or similar, OR we check memberId vs user.member.id
    const isAuthor = user?.memberId === request.member?.id;

    const handleAddUpdate = async () => {
        if (!newUpdate.trim()) return;
        setIsSubmitting(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/prayers/${request.id}/updates`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                    'x-church-id': churchId || ''
                },
                body: JSON.stringify({ content: newUpdate })
            });
            if (res.ok) {
                toast.success('Actualización agregada');
                setNewUpdate('');
                setIsCommenting(false);
                onUpdate();
            }
        } catch (e) {
            toast.error('Error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleMarkAnswered = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/prayers/${request.id}/answer`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}`, 'x-church-id': churchId || '' }
            });
            if (res.ok) {
                toast.success('Marcada como contestada! 🙌');
                onUpdate();
            }
        } catch (e) { toast.error('Error'); }
    };

    // Icons validation
    const VisibilityIcon = {
        'PUBLIC': Globe,
        'LEADERS_ONLY': Shield,
        'PRIVATE': Lock
    }[request.visibility as string] || Globe;

    return (
        <Card className={`border-l-4 ${request.status === 'ANSWERED' ? 'border-l-emerald-500 bg-emerald-50/30' : 'border-l-blue-500'}`}>
            <CardHeader className="flex flex-row items-start gap-4 pb-2">
                <Avatar>
                    <AvatarFallback>{request.member?.person?.fullName[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-semibold text-lg">{request.member?.person?.fullName}</h3>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true, locale: es })}
                                <span>•</span>
                                <VisibilityIcon className="w-3 h-3" />
                                <span className="capitalize">{request.visibility.toLowerCase().replace('_', ' ')}</span>
                            </p>
                        </div>
                        {request.status === 'ANSWERED' && (
                            <Badge className="bg-emerald-600 self-start">Contestada</Badge>
                        )}
                        {request.status === 'ACTIVE' && isAuthor && (
                            <Button variant="outline" size="sm" onClick={handleMarkAnswered} className="text-emerald-600 border-emerald-200 hover:bg-emerald-50">
                                <CheckCircle className="w-4 h-4 mr-1" /> Marcar Contestada
                            </Button>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-gray-800 whitespace-pre-wrap">{request.motive}</p>

                {/* Updates Feed */}
                {request.updates && request.updates.length > 0 && (
                    <div className="mt-4 pl-4 border-l-2 border-gray-100 space-y-3">
                        {request.updates.map((update: any) => (
                            <div key={update.id} className="text-sm">
                                <p className="text-gray-600 bg-gray-50 p-2 rounded-lg inline-block">
                                    {update.content}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    {formatDistanceToNow(new Date(update.createdAt), { locale: es })}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
            <CardFooter className="pt-2 border-t bg-slate-50/50 flex flex-col gap-2 items-stretch">
                {!isCommenting ? (
                    <Button variant="ghost" className="self-start text-gray-500" onClick={() => setIsCommenting(true)}>
                        <MessageSquare className="w-4 h-4 mr-2" /> Agregar Actualización / Comentar
                    </Button>
                ) : (
                    <div className="w-full space-y-2">
                        <Textarea
                            placeholder="Escribe una actualización o palabra de ánimo..."
                            value={newUpdate}
                            onChange={(e) => setNewUpdate(e.target.value)}
                            className="bg-white"
                        />
                        <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => setIsCommenting(false)}>Cancelar</Button>
                            <Button size="sm" onClick={handleAddUpdate} disabled={isSubmitting}>Publicar</Button>
                        </div>
                    </div>
                )}
            </CardFooter>
        </Card>
    );
}
