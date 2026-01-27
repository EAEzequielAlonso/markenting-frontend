import { CalendarEvent } from './agenda';
import { ChurchMember } from './auth-types';

export interface SmallGroup {
    id: string;
    name: string;
    description?: string;
    objective?: string;
    studyMaterial?: string;
    currentTopic?: string;
    meetingDay?: string;
    meetingTime?: string;
    address?: string;
    members?: SmallGroupMember[];
    events?: CalendarEvent[];
    createdAt: string;
    updatedAt: string;
}

export interface SmallGroupMember {
    id: string;
    role: 'MODERATOR' | 'COLLABORATOR' | 'PARTICIPANT';
    member: ChurchMember & {
        person: {
            id: string;
            firstName: string;
            lastName: string;
            avatarUrl?: string;
        };
        user?: {
            id: string;
        };
    };
}

export interface CreateSmallGroupDto {
    name: string;
    description?: string;
    objective?: string;
    studyMaterial?: string;
    currentTopic?: string;
    meetingDay?: string;
    meetingTime?: string;
    address?: string;
}
