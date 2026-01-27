export enum CalendarEventType {
    PERSONAL = 'PERSONAL',
    MINISTRY = 'MINISTRY',
    CHURCH = 'CHURCH',
    COUNSELING = 'COUNSELING',
    SMALL_GROUP = 'SMALL_GROUP',
    OTHER = 'OTHER'
}

export interface CalendarEvent {
    id: string;
    title: string;
    description?: string;
    startDate: string;
    endDate: string;
    location?: string;
    type: CalendarEventType;
    color?: string;
    isAllDay?: boolean;
    ministryId?: string;
    smallGroup?: {
        id: string;
        name: string;
    };
    attendees?: {
        id: string;
        firstName: string;
        lastName: string;
        avatarUrl?: string;
    }[];
}

export interface CreateCalendarEventDto {
    title: string;
    description?: string;
    startDate: string;
    endDate: string;
    location?: string;
    type: CalendarEventType;
    color?: string;
    isAllDay?: boolean;
    ministryId?: string;
    smallGroupId?: string;
    attendeeIds?: string[];
}
