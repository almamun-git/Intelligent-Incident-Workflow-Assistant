import React, { useEffect, useState } from 'react';
import { fetchIncidents } from '../lib/api';
import { Incident } from '../types';

const IncidentList: React.FC = () => {
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadIncidents = async () => {
            try {
                const data = await fetchIncidents();
                setIncidents(data);
            } catch (err) {
                setError('Failed to load incidents');
            } finally {
                setLoading(false);
            }
        };

        loadIncidents();
    }, []);

    if (loading) {
        return <div>Loading incidents...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h2>Incident List</h2>
            <ul>
                {incidents.map((incident) => (
                    <li key={incident.id}>
                        <h3>{incident.title}</h3>
                        <p>{incident.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default IncidentList;