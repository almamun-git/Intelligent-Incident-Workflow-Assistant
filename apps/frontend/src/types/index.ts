export interface Incident {
    id: string;
    title: string;
    description: string;
    status: 'open' | 'in-progress' | 'resolved';
    createdAt: string;
    updatedAt: string;
}

export interface AnalyticsData {
    totalIncidents: number;
    resolvedIncidents: number;
    openIncidents: number;
    incidentsByStatus: Record<string, number>;
}

export interface ApiResponse<T> {
    data: T;
    message: string;
    success: boolean;
}