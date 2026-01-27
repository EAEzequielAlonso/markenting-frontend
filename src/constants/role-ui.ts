import {
    MembershipStatus,
    EcclesiasticalRole,
    MinistryRole,
    SmallGroupRole,
    FamilyRole,
    SystemRole
} from '../types/auth-types';

export const ROLE_UI_METADATA = {
    [SystemRole.ADMIN_APP]: {
        label: 'Super Admin',
        color: 'bg-purple-600 text-white',
        description: 'Administrador global del sistema SaaS.'
    },
    [SystemRole.USER]: {
        label: 'Usuario',
        color: 'bg-slate-200 text-slate-800',
        description: 'Usuario estándar del sistema.'
    },
    // Membership Status
    [MembershipStatus.PROSPECT]: {
        label: 'Candidato',
        color: 'bg-yellow-100 text-yellow-700',
        description: 'En proceso de membresía o discipulado inicial.'
    },
    [MembershipStatus.MEMBER]: {
        label: 'Miembro',
        color: 'bg-green-100 text-green-700',
        description: 'Miembro oficial en plena comunión.'
    },
    [MembershipStatus.DISCIPLINED]: {
        label: 'En Disciplina',
        color: 'bg-red-100 text-red-700',
        description: 'Miembro con restricciones temporales.'
    },
    [MembershipStatus.EXCOMMUNICATED]: {
        label: 'Excomulgado',
        color: 'bg-stone-800 text-white',
        description: 'Separado de la comunión de la iglesia.'
    },
    [MembershipStatus.INACTIVE]: {
        label: 'Inactivo',
        color: 'bg-gray-200 text-gray-500',
        description: 'Miembro histórico o que se ha mudado.'
    },
    // Ecclesiastical Roles
    [EcclesiasticalRole.PASTOR]: {
        label: 'Pastor',
        color: 'bg-indigo-600 text-white',
        description: 'Ministro ordenado responsable de la congregación.'
    },
    [EcclesiasticalRole.BISHOP]: {
        label: 'Obispo',
        color: 'bg-violet-700 text-white',
        description: 'Supervisor de múltiples congregaciones o regiones.'
    },
    [EcclesiasticalRole.ELDER]: {
        label: 'Anciano',
        color: 'bg-indigo-100 text-indigo-800',
        description: 'Líder espiritual y administrativo local.'
    },
    [EcclesiasticalRole.DEACON]: {
        label: 'Diácono',
        color: 'bg-teal-100 text-teal-800',
        description: 'Servidor ordenado para asistencia práctica.'
    },
    [EcclesiasticalRole.LEADER]: {
        label: 'Líder',
        color: 'bg-cyan-100 text-cyan-800',
        description: 'Líder general de áreas o departamentos.'
    },
    [EcclesiasticalRole.NONE]: {
        label: 'Sin Cargo',
        color: 'bg-slate-100 text-slate-500',
        description: 'Miembro sin rol eclesiástico específico.'
    },
    // Ministry Roles
    [MinistryRole.LEADER]: {
        label: 'Líder',
        color: 'bg-orange-100 text-orange-800',
        description: 'Encargado principal del ministerio.'
    },
    [MinistryRole.TEAM_MEMBER]: {
        label: 'Miembro',
        color: 'bg-orange-50 text-orange-600',
        description: 'Parte activa del equipo de trabajo.'
    },
    // Small Group Roles
    [SmallGroupRole.MODERATOR]: {
        label: 'Moderador',
        color: 'bg-emerald-100 text-emerald-800',
        description: 'Líder encargado de dirigir el grupo.'
    },
    [SmallGroupRole.COLLABORATOR]: {
        label: 'Colaborador',
        color: 'bg-emerald-50 text-emerald-600',
        description: 'Ayuda en la logística y cuidado del grupo.'
    },
    [SmallGroupRole.PARTICIPANT]: {
        label: 'Participante',
        color: 'bg-slate-100 text-slate-600',
        description: 'Asistente regular del grupo.'
    },
    // Family Roles
    [FamilyRole.FATHER]: {
        label: 'Padre',
        color: 'bg-blue-50 text-blue-600',
        description: 'Cabeza de familia (Padre).'
    },
    [FamilyRole.MOTHER]: {
        label: 'Madre',
        color: 'bg-pink-50 text-pink-600',
        description: 'Madre de familia.'
    },
    [FamilyRole.CHILD]: {
        label: 'Hijo/a',
        color: 'bg-green-50 text-green-600',
        description: 'Hijo o hija en el núcleo familiar.'
    }
};
