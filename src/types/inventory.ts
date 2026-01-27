export enum InventoryItemCategory {
    FURNITURE = 'FURNITURE',
    SOUND = 'SOUND',
    INSTRUMENTS = 'INSTRUMENTS',
    TECHNOLOGY = 'TECHNOLOGY',
    LIGHTING = 'LIGHTING',
    KITCHEN = 'KITCHEN',
    STATIONERY = 'STATIONERY',
    DECORATION = 'DECORATION',
    OTHER = 'OTHER'
}

export enum InventoryMovementType {
    IN = 'IN',
    OUT = 'OUT'
}

export interface InventoryMovement {
    id: string;
    type: InventoryMovementType;
    quantity: number;
    reason: string;
    observation?: string;
    date: string;
    registeredBy?: {
        id: string;
        person?: { fullName: string };
    };
}

export interface InventoryItem {
    id: string;
    name: string;
    category: InventoryItemCategory;
    description?: string;
    quantity: number;
    location?: string;
    ministry?: {
        id: string;
        name: string;
    };
    movements?: InventoryMovement[];
    imageUrl?: string;
}
