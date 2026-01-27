// Enums (Synced with Backend src/common/enums.ts)

export enum SystemRole {
    ADMIN_APP = 'ADMIN_APP',
    USER = 'USER'
}

export enum PlanType {
    TRIAL = 'TRIAL',
    BASIC = 'BASIC',
    PRO = 'PRO',
    ELITE = 'ELITE',
}

export enum SubscriptionStatus {
    TRIAL = 'TRIAL',
    ACTIVE = 'ACTIVE',
    CANCELLED = 'CANCELLED',
}

export enum MembershipStatus {

    PROSPECT = 'PROSPECT',
    MEMBER = 'MEMBER',
    DISCIPLINED = 'DISCIPLINED',
    EXCOMMUNICATED = 'EXCOMMUNICATED',
    INACTIVE = 'INACTIVE',
    CHILD = 'CHILD'
}

export enum EcclesiasticalRole {
    PASTOR = 'PASTOR',
    BISHOP = 'BISHOP',
    ELDER = 'ELDER',
    DEACON = 'DEACON',
    LEADER = 'LEADER',
    NONE = 'NONE'
}

export enum MinistryRole {
    LEADER = 'MINISTRY_LEADER',
    COORDINATOR = 'MINISTRY_COORDINATOR',
    TEAM_MEMBER = 'MINISTRY_TEAM_MEMBER'
}

export enum SmallGroupRole {
    MODERATOR = 'MODERATOR',
    COLLABORATOR = 'COLLABORATOR',
    PARTICIPANT = 'PARTICIPANT'
}

export enum FamilyRole {
    FATHER = 'FATHER',
    MOTHER = 'MOTHER',
    CHILD = 'CHILD'
}

// Interfaces

export interface Person {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl?: string;
}

export interface User {
    id: string;
    email: string;
    fullName?: string; // From Person
    personId?: string;
    isPlatformAdmin: boolean;
    systemRole: SystemRole;
    isOnboarded: boolean;
    roles: string[]; // Aggregated active roles (Ecclesiastical, etc.) for current context
    avatarUrl?: string; // From Person
}

export interface Church {
    id: string;
    name: string;
    slug: string;
    plan: PlanType;
}

export interface ChurchMember {
    id: string;
    personId: string;
    churchId: string;
    ecclesiasticalRole: EcclesiasticalRole;
    status: MembershipStatus;
    joinedAt: string;
}
