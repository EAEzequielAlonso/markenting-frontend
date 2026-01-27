'use client';

import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

export default function Testimonials() {
    const testimonials = [
        {
            quote: "Ecclesia ha transformado cómo gestionamos el seguimiento de nuevos creyentes. Nadie se queda atrás ahora.",
            author: "Pastor Carlos M.",
            role: "Iglesia Vida Nueva",
            image: "https://i.pravatar.cc/150?u=a042581f4e29026024d"
        },
        {
            quote: "La transparencia en finanzas que logramos con este sistema trajo mucha paz a nuestro equipo de liderazgo.",
            author: "Tesorera Ana G.",
            role: "Comunidad de Fe",
            image: "https://i.pravatar.cc/150?u=a042581f4e29026704d"
        },
        {
            quote: "Simple de usar incluso para nuestros voluntarios mayores. Es una bendición para nuestra administración.",
            author: "Diácono Roberto L.",
            role: "Centro Cristiano Central",
            image: "https://i.pravatar.cc/150?u=a04258114e29026302d"
        }
    ];

    return (
        <section id="testimonios" className="py-32 px-6 bg-[#0f172a] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#7f1d1d]/10 to-transparent pointer-events-none"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-20 space-y-6">
                    <h2 className="text-[#fbbf24] font-black uppercase tracking-[0.3em] text-xs">Testimonios Reales</h2>
                    <h3 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none">Voces del Ministerio</h3>
                    <div className="w-24 h-1.5 bg-[#7f1d1d] mx-auto rounded-full"></div>
                </div>

                <div className="grid md:grid-cols-3 gap-10">
                    {testimonials.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-white/5 border border-white/10 p-10 rounded-[3rem] flex flex-col hover:border-[#fbbf24]/50 transition-all duration-500 shadow-2xl group"
                        >
                            <Quote className="w-12 h-12 text-[#fbbf24]/20 mb-8 group-hover:text-[#fbbf24]/40 transition-colors" />
                            <p className="text-slate-300 italic text-xl mb-10 flex-grow leading-relaxed font-medium">"{item.quote}"</p>
                            <div className="flex items-center space-x-5 border-t border-white/5 pt-8">
                                <img src={item.image} alt={item.author} className="w-14 h-14 rounded-2xl border-2 border-[#fbbf24]/30 object-cover shadow-2xl" />
                                <div>
                                    <h5 className="font-black text-white tracking-tight uppercase text-sm">{item.author}</h5>
                                    <span className="text-[10px] text-[#fbbf24] font-black uppercase tracking-widest">{item.role}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
