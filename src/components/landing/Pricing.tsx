import { CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function Pricing() {
    return (
        <section id="precios" className="py-32 px-6 bg-slate-50 relative overflow-hidden">
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-20 space-y-6">
                    <h2 className="text-[#7f1d1d] font-black uppercase tracking-[0.3em] text-xs">Propuesta de Valor</h2>
                    <h3 className="text-4xl md:text-6xl font-black text-[#0f172a] tracking-tighter leading-none">Inversión para el Ministerio</h3>
                    <div className="w-24 h-1.5 bg-[#fbbf24] mx-auto rounded-full"></div>
                </div>

                <div className="grid md:grid-cols-3 gap-10 items-stretch">
                    {/* Basic Plan */}
                    <div className="p-10 rounded-[3rem] border border-slate-200 bg-white flex flex-col hover:border-[#0f172a]/30 transition-all duration-500 group shadow-sm hover:shadow-2xl">
                        <h4 className="text-2xl font-black text-[#0f172a] mb-2 uppercase tracking-tight">Plan BASIC</h4>
                        <p className="text-slate-500 text-sm mb-8 font-medium italic">Ideal para iglesias en inicio</p>
                        <div className="mb-10 flex items-baseline gap-2">
                            <span className="text-6xl font-black text-[#0f172a] tracking-tighter">$35.000</span>
                            <span className="text-slate-400 font-bold uppercase text-xs tracking-widest">/ mes</span>
                        </div>
                        <ul className="space-y-5 mb-10 flex-1">
                            <FeatureItem text="Hasta 100 miembros" />
                            <FeatureItem text="Gestión de Células" />
                            <FeatureItem text="Finanzas Básicas" />
                            <FeatureItem text="App para miembros" />
                        </ul>
                        <Link href="/register?plan=basic" className="w-full block text-center bg-[#0f172a] text-white font-black py-5 rounded-2xl hover:bg-[#7f1d1d] transition-all transform hover:-translate-y-1 uppercase tracking-widest text-sm shadow-xl shadow-[#0f172a]/20">
                            Comenzar ahora
                        </Link>
                    </div>

                    {/* Pro Plan */}
                    <div className="p-10 rounded-[3rem] border-4 border-[#7f1d1d] bg-white shadow-[0_30px_60px_-15px_rgba(127,29,29,0.3)] relative transform lg:-translate-y-10 flex flex-col group z-20">
                        <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#7f1d1d] text-white text-[10px] font-black px-6 py-2 rounded-full tracking-[0.2em] shadow-xl">
                            MÁS ELEGIDO
                        </div>
                        <h4 className="text-2xl font-black text-[#7f1d1d] mb-2 uppercase tracking-tight">Plan PRO</h4>
                        <p className="text-slate-500 text-sm mb-8 font-medium italic">Para iglesias en expansión</p>
                        <div className="mb-10 flex items-baseline gap-2">
                            <span className="text-6xl font-black text-[#0f172a] tracking-tighter">$65.000</span>
                            <span className="text-slate-400 font-bold uppercase text-xs tracking-widest">/ mes</span>
                        </div>
                        <ul className="space-y-5 mb-10 flex-1">
                            <FeatureItem text="Hasta 500 miembros" isHighlight />
                            <FeatureItem text="Gestión Financiera Avanzada" isHighlight />
                            <FeatureItem text="Seguimiento de visitas" isHighlight />
                            <FeatureItem text="Reportes PDF Profesionales" isHighlight />
                            <FeatureItem text="Soporte Prioritario" isHighlight />
                        </ul>
                        <Link href="/register?plan=pro" className="w-full flex items-center justify-center bg-[#7f1d1d] text-white font-black py-6 rounded-2xl hover:bg-[#0f172a] transition-all shadow-2xl shadow-[#7f1d1d]/40 transform hover:-translate-y-1 uppercase tracking-widest text-sm">
                            Activar Plan PRO <ArrowRight className="ml-3 w-5 h-5" />
                        </Link>
                    </div>

                    {/* Elite Plan */}
                    <div className="p-10 rounded-[3rem] border border-slate-200 bg-white flex flex-col hover:border-[#fbbf24]/50 transition-all duration-500 group shadow-sm hover:shadow-2xl">
                        <h4 className="text-2xl font-black text-[#0f172a] mb-2 uppercase tracking-tight">Plan ELITE</h4>
                        <p className="text-slate-500 text-sm mb-8 font-medium italic">Solución para grandes ministerios</p>
                        <div className="mb-10 flex items-baseline gap-2">
                            <span className="text-6xl font-black text-[#0f172a] tracking-tighter">$100.000</span>
                            <span className="text-slate-400 font-bold uppercase text-xs tracking-widest">/ mes</span>
                        </div>
                        <ul className="space-y-5 mb-10 flex-1">
                            <FeatureItem text="Miembros ilimitados" />
                            <FeatureItem text="Múltiples sedes / Campus" />
                            <FeatureItem text="IA e integración API" />
                            <FeatureItem text="Bits IA Ilimitados" />
                            <FeatureItem text="Asesor VIP 24/7" />
                        </ul>
                        <Link href="/register?plan=elite" className="w-full block text-center bg-white border-2 border-[#fbbf24] text-[#0f172a] font-black py-5 rounded-2xl hover:bg-[#fbbf24] hover:text-[#0f172a] transition-all transform hover:-translate-y-1 uppercase tracking-widest text-sm shadow-xl shadow-[#fbbf24]/10">
                            Contactar Ventas
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

function FeatureItem({ text, isHighlight = false }: { text: string; isHighlight?: boolean }) {
    return (
        <li className={cn("flex items-center text-sm font-bold tracking-tight", isHighlight ? "text-[#0f172a]" : "text-slate-500")}>
            <div className={cn("w-6 h-6 rounded-full flex items-center justify-center mr-4 flex-shrink-0 shadow-sm", isHighlight ? "bg-[#7f1d1d]/10" : "bg-slate-100")}>
                <CheckCircle2 className={cn("w-4 h-4", isHighlight ? "text-[#7f1d1d]" : "text-[#fbbf24]")} />
            </div>
            {text}
        </li>
    );
}
