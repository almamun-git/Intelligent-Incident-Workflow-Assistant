export interface Incident {
    id: string;
    title: string;
    description: string;
    status: 'open' | 'in-progress' | 'resolved' | 'closed';
    createdAt: Date;
    updatedAt: Date;
}

export interface AnalyticsData {
    totalIncidents: number;
    resolvedIncidents: number;
    openIncidents: number;
    incidentsByStatus: Record<string, number>;
}

export interface Action {
    id: string;
    incidentId: string;
    actionType: string;
    createdAt: Date;
}