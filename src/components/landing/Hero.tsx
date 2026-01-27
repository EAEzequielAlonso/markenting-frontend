import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Hero() {
    return (
        <section className="relative pt-32 pb-20 px-6 overflow-hidden min-h-screen flex items-center justify-center bg-[#0f172a] text-white">
            {/* Background Light Effects */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-30">
                <div className="absolute top-[-10%] right-[-10%] w-[70%] h-[70%] bg-[#7f1d1d]/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[70%] h-[70%] bg-[#fbbf24]/5 rounded-full blur-[120px] animate-pulse delay-1000"></div>
            </div>

            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 z-10">
                <div className="flex-1 text-center lg:text-left space-y-8">
                    <div className="animate-fade-in-up inline-flex items-center space-x-2 bg-white/5 border border-white/10 backdrop-blur-sm px-5 py-2 rounded-full shadow-2xl mb-4 hover:border-[#fbbf24]/30 transition-all">
                        <span className="flex h-2 w-2 rounded-full bg-[#fbbf24] animate-ping absolute inline-flex opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#fbbf24]"></span>
                        <span className="text-[10px] font-black text-[#fbbf24] uppercase tracking-[0.3em] pl-2">Plataforma Líder de Gestión Eclesiástica</span>
                    </div>

                    <h1 className="animate-fade-in-up delay-200 text-6xl md:text-8xl font-black tracking-tighter leading-[0.95]">
                        Tu Visión,<br />
                        <span className="text-[#fbbf24]">Elevada.</span>
                    </h1>

                    <p className="animate-fade-in-up delay-400 text-lg md:text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                        Administra tu congregación con la excelencia que el Reino merece. Una herramienta diseñada por y para el ministerio moderno.
                    </p>

                    <div className="animate-fade-in-up delay-600 flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-6 pt-4">
                        <Link href="/register" className="w-full sm:w-auto bg-[#fbbf24] text-[#0f172a] px-10 py-5 rounded-[2rem] font-black text-xl hover:bg-white transition-all shadow-2xl shadow-black/20 flex items-center justify-center group transform hover:-translate-y-1 uppercase tracking-widest">
                            Empezar ahora
                            <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition" />
                        </Link>
                        <Link href="#precios" className="w-full sm:w-auto bg-transparent text-white px-10 py-5 rounded-[2rem] font-bold text-xl border-2 border-white/10 hover:border-[#fbbf24]/50 hover:bg-white/5 transition flex items-center justify-center transform hover:-translate-y-1 uppercase tracking-widest">
                            Explorar Planes
                        </Link>
                    </div>

                    <div className="animate-fade-in-up delay-800 flex items-center justify-center lg:justify-start space-x-8 text-xs font-black text-slate-400 uppercase tracking-widest">
                        <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-[#fbbf24] mr-2" /> 100% Seguro</div>
                        <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-[#fbbf24] mr-2" /> Soporte Pastoral</div>
                    </div>
                </div>

                <div className="flex-1 relative animate-fade-in-up delay-400 w-full max-w-2xl">
                    <div className="absolute -inset-4 bg-gradient-to-r from-[#7f1d1d] to-[#fbbf24] rounded-[3rem] blur-2xl opacity-20 animate-pulse"></div>
                    <div className="relative bg-[#0f172a] border-4 border-white/5 rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] p-2 group">
                        <img
                            src="/images/hero_dashboard.png"
                            alt="Ecclesia Dashboard"
                            className="w-full h-auto rounded-[2rem] transform transition-transform duration-1000 group-hover:scale-[1.05]"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
