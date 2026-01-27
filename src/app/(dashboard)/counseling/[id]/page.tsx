'use client';

import { useState, useEffect, use } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

// Refactored Components


import ProcessHeader from '@/components/counseling/ProcessHeader';
import StatsOverview from '@/components/counseling/StatsOverview';
import SessionsTab from '@/components/counseling/SessionsTab';
import NotesTab from '@/components/counseling/NotesTab';
import TasksTab from '@/components/counseling/TasksTab';
import GeneralInfoTab from '@/components/counseling/GeneralInfoTab';

export default function ProcessDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params); // Unwrap params
    const [careProcess, setCareProcess] = useState<any>(null);
    const [sessions, setSessions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('SESSIONS'); // SESSIONS, NOTES, TASKS, GENERAL

    // Title Editing State
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [editedTitle, setEditedTitle] = useState('');

    // Note State
    const [newNote, setNewNote] = useState('');
    const [newNoteTitle, setNewNoteTitle] = useState('');
    const [noteFilterSessionId, setNoteFilterSessionId] = useState<string>('none');
    const [newNoteSessionId, setNewNoteSessionId] = useState<string>('none');
    const [visibility, setVisibility] = useState('PERSONAL');
    const [sendingNote, setSendingNote] = useState(false);
    const [isNewNoteOpen, setIsNewNoteOpen] = useState(false);
    const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
    const [editingNoteData, setEditingNoteData] = useState({ title: '', content: '' });

    // Session State
    const [isNewSessionOpen, setIsNewSessionOpen] = useState(false);
    const [newSessionData, setNewSessionData] = useState({ date: '', duration: 60, topics: '', location: '' });

    // Task State
    const [newTaskDescription, setNewTaskDescription] = useState('');
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
    const [editingTaskData, setEditingTaskData] = useState({ title: '', description: '' });
    const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

    const router = useRouter();
    const { user } = useAuth();

    useEffect(() => {
        fetchProcess();
        fetchSessions();
    }, [id]);

    useEffect(() => {
        if (careProcess) {
            setEditedTitle(careProcess.motive);
            if (careProcess.type === 'INFORMAL') {
                setVisibility('PERSONAL');
            }
        }
    }, [careProcess]);

    const fetchProcess = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003'}/counseling/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                const data = await res.json();
                setCareProcess(data);
            } else {
                toast.error('No se pudo cargar el proceso');
            }
        } catch (error) {
            toast.error('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    const fetchSessions = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003'}/counseling/${id}/sessions`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setSessions(data);
            }
        } catch (error) {
            console.error('Error fetching sessions:', error);
        }
    };

    const handleUpdateStatus = async (status: string) => {
        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003'}/counseling/${id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });

            if (res.ok) {
                toast.success(`Estado actualizado a ${status}`);
                fetchProcess();
            } else {
                toast.error('No se pudo actualizar el estado');
            }
        } catch (error) {
            toast.error('Error al actualizar estado');
        }
    };

    const handleUpdateTitle = async () => {
        if (!editedTitle.trim()) return;
        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003'}/counseling/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ motive: editedTitle })
            });

            if (res.ok) {
                toast.success('Motivo actualizado');
                setIsEditingTitle(false);
                fetchProcess();
            }
        } catch (error) {
            toast.error('Error al actualizar motivo');
        }
    };

    const handleCreateSession = async () => {
        if (!newSessionData.date) return;
        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003'}/counseling/${id}/sessions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    date: newSessionData.date,
                    durationMinutes: newSessionData.duration,
                    topics: newSessionData.topics,
                    location: newSessionData.location || 'Oficina Iglesia'
                })
            });

            if (res.ok) {
                toast.success('Encuentro agendado');
                setIsNewSessionOpen(false);
                setNewSessionData({ date: '', duration: 60, topics: '', location: '' });
                fetchSessions();
            }
        } catch (error) {
            toast.error('Error al agendar encuentro');
        }
    };

    const handleAddNote = async () => {
        if (!newNote.trim()) return;
        setSendingNote(true);
        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003'}/counseling/${id}/notes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: newNoteTitle,
                    content: newNote,
                    visibility,
                    sessionId: newNoteSessionId === 'none' ? undefined : newNoteSessionId
                })
            });

            if (res.ok) {
                setNewNote('');
                setNewNoteTitle('');
                setNewNoteSessionId('none');
                setIsNewNoteOpen(false);
                toast.success('Nota guardada');
                fetchProcess();
                fetchSessions(); // Fetch sessions to update the note count in cards
            }
        } catch (error) {
            toast.error('Error al guardar nota');
        } finally {
            setSendingNote(false);
        }
    };

    const handleUpdateNote = async (noteId: string) => {
        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003'}/counseling/notes/${noteId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(editingNoteData)
            });

            if (res.ok) {
                toast.success('Nota actualizada');
                setEditingNoteId(null);
                fetchProcess();
            }
        } catch (error) {
            toast.error('Error al actualizar nota');
        }
    };

    const handleDeleteNote = async (noteId: string) => {
        if (!confirm('¿Estás seguro de eliminar este registro?')) return;
        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003'}/counseling/notes/${noteId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                toast.success('Registro eliminado');
                fetchProcess();
                fetchSessions();
            }
        } catch (error) {
            toast.error('Error al eliminar');
        }
    };

    const handleAddTask = async (sessionId: string) => {
        if (!newTaskDescription.trim()) return;
        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003'}/counseling/sessions/${sessionId}/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: newTaskTitle,
                    description: newTaskDescription
                })
            });

            if (res.ok) {
                toast.success('Tarea asignada');
                setNewTaskTitle('');
                setNewTaskDescription('');
                setSelectedSessionId(null);
                fetchSessions();
            }
        } catch (error) {
            toast.error('Error al asignar tarea');
        }
    };

    const handleUpdateTask = async (taskId: string, data: any) => {
        try {
            const token = localStorage.getItem('accessToken');
            const backendData = { ...data };

            // Map frontend fields (counseleeResponse, counselorFeedback) 
            // to backend expected fields (response, feedback)
            if (backendData.counseleeResponse !== undefined) {
                backendData.response = backendData.counseleeResponse;
                delete backendData.counseleeResponse;
            }
            if (backendData.counselorFeedback !== undefined) {
                backendData.feedback = backendData.counselorFeedback;
                delete backendData.counselorFeedback;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003'}/counseling/tasks/${taskId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(backendData)
            });

            if (res.ok) {
                toast.success('Misión actualizada');
                fetchSessions();
            }
        } catch (error) {
            toast.error('Error al actualizar tarea');
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-slate-400 font-bold animate-pulse uppercase tracking-widest text-xs">Cargando Proceso...</p>
            </div>
        );
    }

    if (!careProcess) return <div className="p-8 text-center text-slate-500 font-bold">Proceso no encontrado.</div>;

    // Permissions and Context
    const type = careProcess.type || 'UNKNOWN';
    const myParticipant = careProcess?.participants?.find((p: any) =>
        (user?.personId && p.member?.person?.id === user.personId) ||
        (user?.memberId && p.member?.id === user.memberId)
    );
    const isCounselor = myParticipant?.role === 'COUNSELOR' || myParticipant?.role === 'SUPERVISOR';
    const isCounselee = myParticipant?.role === 'COUNSELEE';

    // Metrics for StatsOverview
    const daysActive = careProcess.createdAt ? Math.floor((new Date().getTime() - new Date(careProcess.createdAt).getTime()) / (1000 * 3600 * 24)) : 0;
    const sharedNotesCount = careProcess.notes?.filter((n: any) => n.visibility === 'SHARED').length || 0;
    const stats = {
        sessionsCount: sessions.length,
        notesCount: isCounselor ? (careProcess.notes?.length || 0) : sharedNotesCount,
        tasksCount: sessions.flatMap(s => s.tasks || []).length,
        daysActive: daysActive
    };

    return (
        <div className="max-w-7xl mx-auto space-y-4 p-3 md:p-6 min-h-screen">
            {/* Header Section */}
            <ProcessHeader
                careProcess={careProcess}
                isCounselor={isCounselor}
                isEditingTitle={isEditingTitle}
                setIsEditingTitle={setIsEditingTitle}
                editedTitle={editedTitle}
                setEditedTitle={setEditedTitle}
                handleUpdateTitle={handleUpdateTitle}
                handleUpdateStatus={handleUpdateStatus}
                isCounselee={isCounselee}
                myParticipant={myParticipant}
            />

            {/* Main Tabs Navigation */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide border-b border-slate-100 mb-2">
                {[
                    { id: 'SESSIONS', label: 'Encuentros', count: sessions.length },
                    { id: 'NOTES', label: 'Bitácora de Notas', count: isCounselor ? careProcess.notes?.length : sharedNotesCount },
                    { id: 'TASKS', label: 'Bitácora de Tareas', count: stats.tasksCount },
                    { id: 'GENERAL', label: 'Información General', count: null }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap uppercase flex items-center gap-2
                            ${activeTab === tab.id
                                ? 'bg-primary text-white shadow-md'
                                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
                    >
                        {tab.label}
                        {tab.count !== null && (
                            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                {tab.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Tab Content Rendering */}
            <div className="mt-2 min-h-[500px]">
                {activeTab === 'SESSIONS' && (
                    <SessionsTab
                        sessions={sessions}
                        isCounselor={isCounselor}
                        type={type}
                        isNewSessionOpen={isNewSessionOpen}
                        setIsNewSessionOpen={setIsNewSessionOpen}
                        newSessionData={newSessionData}
                        setNewSessionData={setNewSessionData}
                        handleCreateSession={handleCreateSession}
                        selectedSessionId={selectedSessionId}
                        setSelectedSessionId={setSelectedSessionId}
                        newTaskTitle={newTaskTitle}
                        setNewTaskTitle={setNewTaskTitle}
                        newTaskDescription={newTaskDescription}
                        setNewTaskDescription={setNewTaskDescription}
                        handleAddTask={handleAddTask}
                        setActiveTab={setActiveTab}
                        setNoteFilterSessionId={setNoteFilterSessionId}
                    />
                )}

                {activeTab === 'NOTES' && (
                    <NotesTab
                        notes={careProcess.notes || []}
                        sessions={sessions}
                        isCounselor={isCounselor}
                        type={type}
                        isNewNoteOpen={isNewNoteOpen}
                        setIsNewNoteOpen={setIsNewNoteOpen}
                        newNoteTitle={newNoteTitle}
                        setNewNoteTitle={setNewNoteTitle}
                        newNote={newNote}
                        setNewNote={setNewNote}
                        visibility={visibility}
                        setVisibility={setVisibility}
                        newNoteSessionId={newNoteSessionId}
                        setNewNoteSessionId={setNewNoteSessionId}
                        sendingNote={sendingNote}
                        handleAddNote={handleAddNote}
                        noteFilterSessionId={noteFilterSessionId}
                        setNoteFilterSessionId={setNoteFilterSessionId}
                        editingNoteId={editingNoteId}
                        setEditingNoteId={setEditingNoteId}
                        editingNoteData={editingNoteData}
                        setEditingNoteData={setEditingNoteData}
                        handleUpdateNote={handleUpdateNote}
                        handleDeleteNote={handleDeleteNote}
                    />
                )}

                {activeTab === 'TASKS' && (
                    <TasksTab
                        sessions={sessions}
                        isCounselor={isCounselor}
                        isCounselee={isCounselee}
                        expandedTaskId={expandedTaskId}
                        setExpandedTaskId={setExpandedTaskId}
                        editingTaskId={editingTaskId}
                        setEditingTaskId={setEditingTaskId}
                        editingTaskData={editingTaskData}
                        setEditingTaskData={setEditingTaskData}
                        handleUpdateTask={handleUpdateTask}
                    />
                )}

                {activeTab === 'GENERAL' && (
                    <div className="space-y-6">
                        <StatsOverview
                            careProcess={careProcess}
                            {...stats}
                        />
                        <GeneralInfoTab
                            careProcess={careProcess}
                            sessions={sessions}
                            notes={careProcess.notes || []}
                            isCounselor={isCounselor}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
