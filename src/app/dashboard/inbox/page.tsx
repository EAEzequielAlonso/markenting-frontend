"use client"

import * as React from "react"
import axios from "axios"
import {
    Search,
    MessageCircle,
    User,
    MoreVertical,
    Send,
    Filter,
    Clock,
    CheckCheck,
    Bot,
    User as UserIcon
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
}

interface Lead {
    id: string;
    phoneNumber: string;
    status: 'COLD' | 'INTERESTED' | 'READY_TO_CLOSE' | 'CLOSED';
    conversationHistory: Message[];
    updatedAt: string;
}

export default function InboxPage() {
    const [leads, setLeads] = React.useState<Lead[]>([])
    const [selectedLead, setSelectedLead] = React.useState<Lead | null>(null)
    const [loading, setLoading] = React.useState(true)
    const [message, setMessage] = React.useState("")

    React.useEffect(() => {
        fetchLeads()
    }, [])

    const fetchLeads = async () => {
        try {
            const token = localStorage.getItem("token")
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/whatsapp/inbox`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setLeads(response.data)
            if (response.data.length > 0 && !selectedLead) {
                setSelectedLead(response.data[0])
            }
        } catch (error) {
            console.error("Error fetching leads:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!message || !selectedLead) return

        // Por ahora solo simulamos el envío en la UI
        const newMessage: Message = {
            role: 'assistant',
            content: message,
            timestamp: new Date().toISOString()
        }

        setSelectedLead({
            ...selectedLead,
            conversationHistory: [...selectedLead.conversationHistory, newMessage]
        })
        setMessage("")
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COLD': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
            case 'INTERESTED': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
            case 'READY_TO_CLOSE': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
            default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
        }
    }

    return (
        <div className="flex h-[calc(100vh-120px)] gap-0 overflow-hidden rounded-xl border bg-background shadow-lg">
            {/* Sidebar: Chats List */}
            <div className="w-80 border-r flex flex-col bg-muted/10">
                <div className="p-4 border-b space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="font-bold text-xl">Inbox</h2>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Filter className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Buscar chats..." className="pl-8 h-9 bg-background" />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {leads.map((lead) => (
                        <div
                            key={lead.id}
                            onClick={() => setSelectedLead(lead)}
                            className={cn(
                                "p-4 border-b cursor-pointer transition-colors hover:bg-muted/50",
                                selectedLead?.id === lead.id ? "bg-primary/5 border-r-4 border-r-primary" : ""
                            )}
                        >
                            <div className="flex items-start gap-3">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                    {lead.phoneNumber.slice(-2)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-1">
                                        <p className="font-semibold text-sm truncate">{lead.phoneNumber}</p>
                                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                            {new Date(lead.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground truncate italic">
                                        {lead.conversationHistory?.[lead.conversationHistory.length - 1]?.content || "Sin mensajes"}
                                    </p>
                                    <div className="mt-2">
                                        <Badge variant="secondary" className={cn("text-[10px] uppercase px-1.5 h-4", getStatusColor(lead.status))}>
                                            {lead.status.replace('_', ' ')}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {leads.length === 0 && !loading && (
                        <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-3 opacity-50">
                            <MessageCircle className="h-12 w-12" />
                            <p className="text-sm">Aún no hay conversaciones.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Chat View */}
            <div className="flex-1 flex flex-col bg-background">
                {selectedLead ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b flex items-center justify-between bg-muted/5">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white">
                                    <UserIcon className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">{selectedLead.phoneNumber}</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-[10px] text-muted-foreground uppercase font-medium">WhatsApp Business</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" className="h-8 text-xs">
                                    <Bot className="mr-2 h-3.5 w-3.5" /> IA Activa
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-dot-grid">
                            <div className="text-center py-4">
                                <Badge variant="outline" className="text-[10px] text-muted-foreground">HOY</Badge>
                            </div>
                            {selectedLead.conversationHistory.map((chat, idx) => (
                                <div
                                    key={idx}
                                    className={cn(
                                        "flex flex-col max-w-[80%] space-y-1",
                                        chat.role === 'assistant' ? "ml-auto items-end" : "items-start"
                                    )}
                                >
                                    <div className={cn(
                                        "px-4 py-2.5 rounded-2xl text-sm shadow-sm",
                                        chat.role === 'assistant'
                                            ? "bg-primary text-primary-foreground rounded-tr-none"
                                            : "bg-muted text-foreground rounded-tl-none border"
                                    )}>
                                        {chat.content}
                                    </div>
                                    <div className="flex items-center gap-1.5 px-1">
                                        <span className="text-[10px] text-muted-foreground italic">
                                            {new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        {chat.role === 'assistant' && <CheckCheck className="h-3 w-3 text-primary" />}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t bg-muted/5">
                            <form onSubmit={handleSendMessage} className="flex gap-2">
                                <Input
                                    className="flex-1 bg-background"
                                    placeholder="Escribe un mensaje..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                                <Button type="submit" size="icon" className="h-10 w-10">
                                    <Send className="h-4 w-4" />
                                </Button>
                            </form>
                            <p className="mt-2 text-[10px] text-center text-muted-foreground">
                                Tu Agente Vendedor responderá automáticamente en menos de 5 segundos.
                            </p>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-4 opacity-30">
                        <div className="p-6 rounded-full bg-muted">
                            <MessageCircle className="h-16 w-16" />
                        </div>
                        <h2 className="text-2xl font-bold">Selecciona una conversación</h2>
                    </div>
                )}
            </div>
        </div>
    )
}
