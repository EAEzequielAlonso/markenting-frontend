'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navClasses = cn(
        'fixed top-0 w-full z-50 transition-all duration-500 border-b',
        scrolled
            ? 'bg-[#7f1d1d] border-white/10 py-3 shadow-2xl'
            : 'bg-transparent border-transparent py-6'
    );

    return (
        <header className={navClasses}>
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-3 group">
                    <div className="w-11 h-11 bg-gradient-to-br from-primary to-orange-600 rounded-2xl flex items-center justify-center shadow-2xl group-hover:rotate-6 transition-all duration-500 border border-white/20">
                        <span className="text-white font-black text-2xl tracking-tighter">E</span>
                    </div>
                    <span className="text-2xl font-black tracking-tighter text-white">
                        Ecclesia<span className="text-[#fbbf24] italic">SaaS</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center space-x-10">
                    <Link href="#funciones" className="text-sm font-black text-white/80 hover:text-[#fbbf24] transition-colors tracking-widest uppercase">Funciones</Link>
                    <Link href="#precios" className="text-sm font-black text-white/80 hover:text-[#fbbf24] transition-colors tracking-widest uppercase">Precios</Link>
                    <Link href="#testimonios" className="text-sm font-black text-white/80 hover:text-[#fbbf24] transition-colors tracking-widest uppercase">Testimonios</Link>
                </nav>

                {/* Desktop CTA */}
                <div className="hidden md:flex items-center space-x-6">
                    <Link href="/login" className="text-sm font-black text-white hover:text-[#fbbf24] transition-colors tracking-widest uppercase">
                        Ingresar
                    </Link>
                    <Link
                        href="/register"
                        className="bg-[#fbbf24] text-[#7f1d1d] px-8 py-3 rounded-2xl font-black text-sm hover:bg-white transition-all shadow-xl shadow-black/20 active:scale-95 uppercase tracking-widest"
                    >
                        Prueba Gratis
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 text-slate-600"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-b border-slate-200 overflow-hidden"
                    >
                        <nav className="flex flex-col p-6 space-y-4">
                            <Link href="#funciones" className="text-lg font-medium text-slate-700" onClick={() => setMobileMenuOpen(false)}>Funciones</Link>
                            <Link href="#precios" className="text-lg font-medium text-slate-700" onClick={() => setMobileMenuOpen(false)}>Precios</Link>
                            <Link href="#testimonios" className="text-lg font-medium text-slate-700" onClick={() => setMobileMenuOpen(false)}>Testimonios</Link>
                            <hr className="border-slate-100" />
                            <Link href="/login" className="text-lg font-medium text-slate-700" onClick={() => setMobileMenuOpen(false)}>Iniciar Sesión</Link>
                            <Link
                                href="/register"
                                className="bg-[#fbbf24] text-[#7f1d1d] text-center py-4 rounded-2xl font-black shadow-xl shadow-black/20 uppercase tracking-widest text-sm"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Prueba Gratis
                            </Link>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
