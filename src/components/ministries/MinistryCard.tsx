import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface MinistryCardProps {
    ministry: {
        id: string;
        name: string;
        description: string;
        color?: string;
    };
    onClick: () => void;
}

export function MinistryCard({ ministry, onClick }: MinistryCardProps) {
    return (
        <Card
            className="cursor-pointer hover:shadow-lg transition-all border-l-4"
            style={{ borderLeftColor: ministry.color || '#3b82f6' }}
            onClick={onClick}
        >
            <CardHeader>
                <CardTitle className="text-xl text-primary">{ministry.name}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-gray-500 line-clamp-2">
                    {ministry.description || 'Sin descripción'}
                </p>
            </CardContent>
        </Card>
    );
}
