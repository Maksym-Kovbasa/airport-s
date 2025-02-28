import React, { useState, useEffect } from 'react';
import { airportApi } from '../services/api';
import AirportForm from './AirportForm';
import AirportMap from './AirportMap';

const AirportList = () => {
    const [airports, setAirports] = useState([]);
    const [editingAirport, setEditingAirport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mapCenter, setMapCenter] = useState([50.4501, 30.5234]);
    useEffect(() => {
        loadAirports();
    }, []);

    const loadAirports = async () => {
        try {
            setLoading(true);
            const response = await airportApi.getAllAirports();
            const airportsWithCoordinates = response.data.map(airport => ({
                ...airport,
                latitude: Number(airport.latitude),
                longitude: Number(airport.longitude)
            }));
            
            console.log('Processed airports with coordinates:', airportsWithCoordinates);
            setAirports(airportsWithCoordinates);
        } catch (error) {
            console.error('Error loading airports:', error);
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
            <div className='map'>
            <AirportMap 
                airports={airports}
                center={mapCenter}
                onAirportSelect={(airport) => setEditingAirport(airport)}
            />
            </div>
            
            {loading ? (
                <div className="loading-skeleton">Loading...</div>
            ) : (
                <div className="table-container">
                    <table className='airport-table'>
                        <thead className='airport-table-head'>
                            <tr>
                                <th>Airplane Name</th>
                                <th>Airport Code (name)</th>
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
            <AirportForm 
                onAirportAdded={airport => setAirports([...airports, airport])}
                editingAirport={editingAirport}
                onUpdate={handleUpdate}
            />
        </div>
    );
};

export default AirportList;