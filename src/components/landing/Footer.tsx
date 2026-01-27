import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-[#0f172a] text-slate-400 py-20 px-6 relative overflow-hidden border-t border-white/10">
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#7f1d1d]/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 relative z-10">
                <div className="col-span-2 space-y-8">
                    <div className="flex items-center space-x-3 group">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-orange-600 rounded-2xl flex items-center justify-center shadow-2xl border border-white/20">
                            <span className="text-white font-black text-2xl">E</span>
                        </div>
                        <span className="text-3xl font-black text-white tracking-tighter">Ecclesia<span className="text-[#fbbf24] italic">SaaS</span></span>
                    </div>
                    <p className="max-w-md text-base leading-relaxed text-slate-300 font-medium">
                        Equipando a la Iglesia con tecnología de excelencia para administrar los recursos del Reino con sabiduría, transparencia y visión de eternidad.
                    </p>
                </div>

                <div className="space-y-6">
                    <h4 className="text-white font-black uppercase tracking-[0.2em] text-[10px]">Producto</h4>
                    <ul className="space-y-3 text-sm font-bold">
                        <li><Link href="#funciones" className="hover:text-[#fbbf24] transition-colors uppercase tracking-widest text-[11px]">Funciones</Link></li>
                        <li><Link href="#precios" className="hover:text-[#fbbf24] transition-colors uppercase tracking-widest text-[11px]">Precios</Link></li>
                        <li><Link href="#testimonios" className="hover:text-[#fbbf24] transition-colors uppercase tracking-widest text-[11px]">Testimonios</Link></li>
                        <li><Link href="/login" className="hover:text-[#fbbf24] transition-colors uppercase tracking-widest text-[11px]">Ingresar</Link></li>
                    </ul>
                </div>

                <div className="space-y-6">
                    <h4 className="text-white font-black uppercase tracking-[0.2em] text-[10px]">Legal</h4>
                    <ul className="space-y-3 text-sm font-bold">
                        <li><Link href="#" className="hover:text-[#fbbf24] transition-colors uppercase tracking-widest text-[11px]">Privacidad</Link></li>
                        <li><Link href="#" className="hover:text-[#fbbf24] transition-colors uppercase tracking-widest text-[11px]">Términos</Link></li>
                        <li><Link href="#" className="hover:text-[#fbbf24] transition-colors uppercase tracking-widest text-[11px]">Soporte VIP</Link></li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center font-black tracking-widest text-[10px] uppercase text-slate-500">
                <p>&copy; {new Date().getFullYear()} Ecclesia Platform. Excelencia Ministerial.</p>
                <p className="mt-4 md:mt-0 text-[#fbbf24]/50 tracking-[0.3em]">Hecho con Pasión y Propósito</p>
            </div>
        </footer>
    );
}
