'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Plus, X, Lock, Users, ShieldAlert, Edit3, Trash2 } from 'lucide-react';

interface NotesTabProps {
    notes: any[];
    sessions: any[];
    isCounselor: boolean;
    type: string;
    isNewNoteOpen: boolean;
    setIsNewNoteOpen: (val: boolean) => void;
    newNoteTitle: string;
    setNewNoteTitle: (val: string) => void;
    newNote: string;
    setNewNote: (val: string) => void;
    visibility: string;
    setVisibility: (val: string) => void;
    newNoteSessionId: string;
    setNewNoteSessionId: (val: string) => void;
    sendingNote: boolean;
    handleAddNote: () => void;
    noteFilterSessionId: string;
    setNoteFilterSessionId: (val: string) => void;
    editingNoteId: string | null;
    setEditingNoteId: (val: string | null) => void;
    editingNoteData: any;
    setEditingNoteData: (val: any) => void;
    handleUpdateNote: (id: string) => void;
    handleDeleteNote: (id: string) => void;
}

export default function NotesTab({
    notes,
    sessions,
    isCounselor,
    type,
    isNewNoteOpen,
    setIsNewNoteOpen,
    newNoteTitle,
    setNewNoteTitle,
    newNote,
    setNewNote,
    visibility,
    setVisibility,
    newNoteSessionId,
    setNewNoteSessionId,
    sendingNote,
    handleAddNote,
    noteFilterSessionId,
    setNoteFilterSessionId,
    editingNoteId,
    setEditingNoteId,
    editingNoteData,
    setEditingNoteData,
    handleUpdateNote,
    handleDeleteNote
}: NotesTabProps) {
    const [noteSearch, setNoteSearch] = useState('');

    const filteredNotes = notes.filter((n: any) => {
        const matchesSearch = n.title?.toLowerCase().includes(noteSearch.toLowerCase()) ||
            n.content?.toLowerCase().includes(noteSearch.toLowerCase());
        const matchesSession = noteFilterSessionId === 'none' || n.session?.id === noteFilterSessionId;
        return matchesSearch && matchesSession;
    });

    return (
        <Card className="border-none shadow-sm bg-white overflow-hidden">
            <CardContent className="p-4 space-y-4">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                    <div className="flex gap-2 flex-1 w-full min-w-0">
                        <Input
                            placeholder="Buscar en la bitácora..."
                            className="h-9 text-xs flex-1 bg-slate-50 border-none transition-all focus:bg-white focus:ring-1 ring-primary/20"
                            value={noteSearch}
                            onChange={(e) => setNoteSearch(e.target.value)}
                        />
                        <Select value={noteFilterSessionId} onValueChange={setNoteFilterSessionId}>
                            <SelectTrigger className="h-9 w-[180px] text-xs bg-slate-50 border-none">
                                <SelectValue placeholder="Filtrar por encuentro" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">Todos los encuentros</SelectItem>
                                {sessions.map(s => (
                                    <SelectItem key={s.id} value={s.id}>{new Date(s.date).toLocaleDateString()}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {isCounselor && (
                        <Button className="h-9 font-bold bg-emerald-600 hover:bg-emerald-700 shadow-sm whitespace-nowrap" onClick={() => setIsNewNoteOpen(!isNewNoteOpen)}>
                            {isNewNoteOpen ? <X className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                            Nueva Nota
                        </Button>
                    )}
                </div>

                {isNewNoteOpen && (
                    <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-4 animate-in fade-in slide-in-from-top-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">Título de la Nota</Label>
                                <Input
                                    placeholder="Ej: Observación inicial, Progreso de la semana..."
                                    className="h-9 text-xs bg-white border-emerald-100"
                                    value={newNoteTitle}
                                    onChange={(e) => setNewNoteTitle(e.target.value)}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">Vincular a Encuentro</Label>
                                <Select value={newNoteSessionId} onValueChange={setNewNoteSessionId}>
                                    <SelectTrigger className="h-9 text-xs bg-white border-emerald-100">
                                        <SelectValue placeholder="Seleccionar encuentro" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">Sin encuentro específico</SelectItem>
                                        {sessions.map(s => (
                                            <SelectItem key={s.id} value={s.id}>{new Date(s.date).toLocaleDateString()} - {s.topics}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">Contenido de la Nota</Label>
                            <Textarea
                                placeholder="Escribe aquí los detalles del proceso... (Guiones para viñetas y espacios para párrafos)"
                                className="min-h-[120px] text-xs bg-white border-emerald-100"
                                value={newNote}
                                onChange={(e) => setNewNote(e.target.value)}
                            />
                        </div>
                        <div className="flex justify-between items-center gap-4">
                            <div className="flex-1 max-w-[200px]">
                                <Select value={visibility} onValueChange={setVisibility} disabled={type === 'INFORMAL'}>
                                    <SelectTrigger className="h-8 text-[10px] bg-white border-emerald-100 font-bold">
                                        <SelectValue placeholder="Visibilidad" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PERSONAL" className="text-[10px] font-bold">
                                            <div className="flex items-center gap-2">
                                                <Lock className="w-3 h-3 text-red-500" />
                                                <span>Personal (Solo yo)</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="SHARED" className="text-[10px] font-bold">
                                            <div className="flex items-center gap-2">
                                                <Users className="w-3 h-3 text-blue-500" />
                                                <span>Compartida (yo y el aconsejado)</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="SUPERVISION" className="text-[10px] font-bold">
                                            <div className="flex items-center gap-2">
                                                <ShieldAlert className="w-3 h-3 text-amber-500" />
                                                <span>Supervisión (Yo y los pastores)</span>
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="sm" className="h-8 text-xs font-bold text-slate-400" onClick={() => setIsNewNoteOpen(false)}>Cancelar</Button>
                                <Button size="sm" className="h-8 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 px-6 shadow-sm" onClick={handleAddNote} disabled={sendingNote || !newNote.trim()}>
                                    {sendingNote ? 'Guardando...' : 'Guardar en Bitácora'}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="space-y-3">
                    {filteredNotes.length > 0 ? (
                        filteredNotes.map((note: any) => (
                            <Card key={note.id} className="border-slate-200/60 hover:border-primary/20 transition-colors shadow-none overflow-hidden group">
                                <CardContent className="p-3 space-y-2">
                                    <div className="flex justify-between items-start">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-sm text-slate-900 group-hover:text-primary transition-colors">{note.title || 'Nota General'}</span>
                                            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">
                                                {new Date(note.createdAt).toLocaleDateString()} • {new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • POR {note.author?.person?.fullName}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Badge variant="secondary" className={`text-[9px] px-1.5 py-0.5 h-auto font-bold flex items-center gap-1.5 ${note.visibility === 'PERSONAL' ? 'bg-red-50 text-red-700 border border-red-100' :
                                                    note.visibility === 'SHARED' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                                                        'bg-amber-50 text-amber-700 border border-amber-100'
                                                }`}>
                                                {note.visibility === 'PERSONAL' && <><Lock className="w-2.5 h-2.5" /> PERSONAL</>}
                                                {note.visibility === 'SHARED' && <><Users className="w-2.5 h-2.5" /> COMPARTIDA</>}
                                                {note.visibility === 'SUPERVISION' && <><ShieldAlert className="w-2.5 h-2.5" /> SUPERVISIÓN</>}
                                            </Badge>
                                            {isCounselor && (
                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6 text-slate-400 hover:text-primary transition-colors"
                                                        onClick={() => {
                                                            setEditingNoteId(note.id);
                                                            setEditingNoteData({
                                                                title: note.title,
                                                                content: note.content,
                                                                visibility: note.visibility
                                                            });
                                                        }}
                                                    >
                                                        <Edit3 className="w-3 h-3" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6 text-slate-400 hover:text-red-500 transition-colors"
                                                        onClick={() => handleDeleteNote(note.id)}
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {editingNoteId === note.id ? (
                                        <div className="space-y-2 pt-2 border-t animate-in slide-in-from-top-1 duration-200">
                                            <Input
                                                value={editingNoteData.title}
                                                onChange={(e) => setEditingNoteData({ ...editingNoteData, title: e.target.value })}
                                                className="h-8 text-xs bg-white"
                                            />
                                            <Textarea
                                                value={editingNoteData.content}
                                                onChange={(e) => setEditingNoteData({ ...editingNoteData, content: e.target.value })}
                                                className="text-xs min-h-[100px] bg-white"
                                            />
                                            <div className="flex justify-between items-center gap-2">
                                                <div className="flex-1 max-w-[180px]">
                                                    <Select
                                                        value={editingNoteData.visibility}
                                                        onValueChange={(val) => setEditingNoteData({ ...editingNoteData, visibility: val })}
                                                        disabled={type === 'INFORMAL'}
                                                    >
                                                        <SelectTrigger className="h-7 text-[9px] bg-white font-bold">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="PERSONAL" className="text-[9px] font-bold">Personal (Solo yo)</SelectItem>
                                                            <SelectItem value="SHARED" className="text-[9px] font-bold">Compartida (Aconsejado)</SelectItem>
                                                            <SelectItem value="SUPERVISION" className="text-[9px] font-bold">Supervisión (Pastores)</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button variant="ghost" size="sm" className="h-7 text-xs font-bold" onClick={() => setEditingNoteId(null)}>Cancelar</Button>
                                                    <Button size="sm" className="h-7 text-xs font-bold shadow-sm bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => handleUpdateNote(note.id)}>Guardar Cambios</Button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{note.content}</p>
                                    )}
                                    {note.session && (
                                        <div className="pt-2 border-t border-slate-50 flex items-center gap-1">
                                            <span className="text-[9px] font-bold text-blue-600/80 bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-tight">🔗 Encuentro: {new Date(note.session.date).toLocaleDateString()}</span>
                                            {note.session.topics && <span className="text-[9px] text-slate-400 truncate max-w-[200px]">{note.session.topics}</span>}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="text-center py-12 rounded-xl border border-dashed border-slate-200 bg-white/50">
                            <MessageSquare className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                            <p className="text-xs font-bold text-slate-400">No hay notas para mostrar.</p>
                            <p className="text-[10px] text-slate-300">Usa el botón "Nueva Nota" para documentar el progreso.</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
