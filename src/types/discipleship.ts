export enum DiscipleshipStatus {
    ACTIVE = 'ACTIVE',
    PAUSED = 'PAUSED',
    COMPLETED = 'COMPLETED',
}

export enum DiscipleshipRole {
    DISCIPLER = 'DISCIPLER',
    DISCIPLE = 'DISCIPLE',
    SUPERVISOR = 'SUPERVISOR',
}

export enum DiscipleshipNoteType {
    PRIVATE = 'PRIVATE',
    SHARED = 'SHARED',
    SUPERVISION = 'SUPERVISION',
}

export enum DiscipleshipTaskStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
}

export interface DiscipleshipParticipant {
    id: string;
    member: {
        id: string;
        person: {
            id: string;
            fullName: string;
            email?: string;
            avatarUrl?: string;
        };
    };
    role: DiscipleshipRole;
    joinedAt: string;
}

export interface Discipleship {
    id: string;
    name?: string;
    objective?: string;
    studyMaterial?: string;
    status: DiscipleshipStatus;
    startDate: string;
    endDate?: string;
    participants: DiscipleshipParticipant[];
    createdAt: string;
    updatedAt: string;
}
