import { Users, Coins, HeartHandshake, Calendar, ShieldCheck, BarChart3 } from 'lucide-react';

export default function Features() {
    const features = [
        {
            icon: <Users className="w-8 h-8" />,
            title: "Membresía Dinámica",
            description: "Base de datos viva de tu congregación. Seguimiento de crecimiento espiritual y bautismos.",
            color: "text-[#0f172a]",
            bg: "bg-[#0f172a]/5"
        },
        {
            icon: <Coins className="w-8 h-8" />,
            title: "Tesorería Precisa",
            description: "Control absoluto de diezmos y ofrendas. Reportes automáticos para máxima transparencia.",
            color: "text-[#7f1d1d]",
            bg: "bg-[#7f1d1d]/5"
        },
        {
            icon: <BarChart3 className="w-8 h-8" />,
            title: "Reportes en Tiempo Real",
            description: "Analítica detallada sobre asistencia, crecimiento y finanzas en un solo clic.",
            color: "text-[#fbbf24]",
            bg: "bg-[#fbbf24]/5"
        },
        {
            icon: <Calendar className="w-8 h-8" />,
            title: "Agenda Ministerial",
            description: "Organiza eventos, cultos y predicaciones. Gestiona voluntarios y recursos.",
            color: "text-[#0f172a]",
            bg: "bg-[#0f172a]/5"
        },
        {
            icon: <ShieldCheck className="w-8 h-8" />,
            title: "Seguridad Bancaria",
            description: "Tus datos están protegidos con encriptación avanzada y accesos por roles.",
            color: "text-[#7f1d1d]",
            bg: "bg-[#7f1d1d]/5"
        },
        {
            icon: <HeartHandshake className="w-8 h-8" />,
            title: "Pastoreo Dirigido",
            description: "Registra seguimientos espirituales y consejerías bajo estricta confidencialidad.",
            color: "text-[#fbbf24]",
            bg: "bg-[#fbbf24]/5"
        }
    ];

    return (
        <section id="funciones" className="py-32 px-6 bg-white shrink-0">
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-20 space-y-6">
                    <h2 className="text-[#fbbf24] font-black uppercase tracking-[0.3em] text-xs">Excelencia Operativa</h2>
                    <h3 className="text-4xl md:text-6xl font-black text-[#0f172a] tracking-tighter leading-none">
                        Módulos diseñados para<br />la expansión.
                    </h3>
                    <div className="w-24 h-1.5 bg-[#7f1d1d] mx-auto rounded-full"></div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {features.map((feature, index) => (
                        <div key={index} className="group p-10 rounded-[3rem] border border-slate-100 bg-slate-50 shadow-sm hover:shadow-2xl hover:bg-white hover:border-[#fbbf24]/30 transition-all duration-700 hover:-translate-y-2">
                            <div className={`w-20 h-20 rounded-[1.5rem] flex items-center justify-center mb-8 ${feature.bg} shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-all duration-700`}>
                                <div className={feature.color}>{feature.icon}</div>
                            </div>
                            <h4 className="text-2xl font-black text-[#0f172a] mb-4 tracking-tight">{feature.title}</h4>
                            <p className="text-slate-500 leading-relaxed font-medium">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
