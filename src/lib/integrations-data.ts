import { Facebook, Instagram, Twitter, Youtube, MessageCircle, Globe, Linkedin, MessageSquare } from "lucide-react";

export const integrations = [
    {
        name: "Facebook",
        icon: Facebook,
        description: "Ads, posts automáticos, análisis y optimización de campañas.",
        color: "#1877F2",
    },
    {
        name: "Instagram",
        icon: Instagram,
        description: "Reels, stories, copies, ads y hashtags optimizados por IA.",
        color: "#E4405F",
    },
    {
        name: "TikTok",
        icon: MessageSquare, // Using MessageSquare as a placeholder for TikTok if no specific icon
        description: "Ideas de contenido, copies, ads y detección de tendencias.",
        color: "#000000",
    },
    {
        name: "X (Twitter)",
        icon: Twitter,
        description: "Publicaciones automáticas y posicionamiento de marca constante.",
        color: "#1DA1F2",
    },
    {
        name: "YouTube",
        icon: Youtube,
        description: "Títulos, descripciones, SEO e ideas de videos virales.",
        color: "#FF0000",
    },
    {
        name: "WhatsApp",
        icon: MessageCircle,
        description: "Respuestas automáticas con IA y seguimiento inteligente de leads.",
        color: "#25D366",
    },
    {
        name: "Google (Ads + SEO)",
        icon: Globe,
        description: "Campañas, keywords, optimización y posicionamiento web.",
        color: "#4285F4",
    },
    {
        name: "LinkedIn",
        icon: Linkedin,
        description: "Contenido profesional, marca personal y estrategias B2B.",
        color: "#0A66C2",
    },
];
