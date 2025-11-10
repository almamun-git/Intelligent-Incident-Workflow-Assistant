import React, { useState } from 'react';

const IncidentForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [severity, setSeverity] = useState('low');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const incidentData = { title, description, severity };

        try {
            const response = await fetch('/api/incidents', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(incidentData),
            });

            if (response.ok) {
                // Handle successful submission (e.g., reset form or show a success message)
                setTitle('');
                setDescription('');
                setSeverity('low');
            } else {
                // Handle error response
                console.error('Failed to submit incident');
            }
        } catch (error) {
            console.error('Error submitting incident:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="title">Title:</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="description">Description:</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="severity">Severity:</label>
                <select
                    id="severity"
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
            </div>
            <button type="submit">Submit Incident</button>
        </form>
    );
};

export default IncidentForm;