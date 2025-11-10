import React, { useEffect, useState } from 'react';
import { fetchIncidents } from '../../lib/api';
import IncidentList from '../../components/IncidentList';
import IncidentForm from '../../components/IncidentForm';

const IncidentsPage = () => {
    const [incidents, setIncidents] = useState([]);

    useEffect(() => {
        const loadIncidents = async () => {
            const data = await fetchIncidents();
            setIncidents(data);
        };

        loadIncidents();
    }, []);

    return (
        <div>
            <h1>Incidents</h1>
            <IncidentForm />
            <IncidentList incidents={incidents} />
        </div>
    );
};

export default IncidentsPage;