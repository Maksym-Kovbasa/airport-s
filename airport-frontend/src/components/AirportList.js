import React, { useState, useEffect } from 'react';
import { airportApi } from '../services/api';
import AirportForm from './AirportForm';

const AirportList = () => {
    const [airports, setAirports] = useState([]);
    const [editingAirport, setEditingAirport] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAirports();
    }, []);

    const loadAirports = async () => {
        try {
            setLoading(true);
            const response = await airportApi.getAllAirports();
            setAirports(response.data);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (updatedAirport) => {
        try {
            const response = await airportApi.updateAirport(updatedAirport.id, updatedAirport);
            const updatedData = response.data;
            
            setAirports(prevAirports => 
                prevAirports.map(airport => 
                    airport.id === updatedData.id ? updatedData : airport
                )
            );
            await loadAirports();
            setEditingAirport(null);
        } catch (error) {
            console.log('Update failed:', error);
        }
    };
    

    return (
        <div className="section-container">
            <div className="section-header">  
            </div>
            <AirportForm 
                onAirportAdded={airport => setAirports([...airports, airport])}
                editingAirport={editingAirport}
                onUpdate={handleUpdate}
            />
            {loading ? (
                <div className="loading-skeleton">Loading...</div>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Code</th>
                                <th>City</th>
                                <th>Country</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {airports.map(airport => (
                                <tr key={airport.id}>
                                    <td>{airport.name}</td>
                                    <td>
                                        <span className="code-badge">
                                            {airport.code}
                                        </span>
                                    </td>
                                    <td>{airport.city}</td>
                                    <td>{airport.country}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button 
                                                className="btn-edit"
                                                onClick={() => setEditingAirport(airport)}
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                className="btn-delete"
                                                onClick={() => {
                                                    airportApi.deleteAirport(airport.id);
                                                    setAirports(airports.filter(a => a.id !== airport.id));
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AirportList;