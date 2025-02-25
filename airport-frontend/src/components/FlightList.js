import React, { useState, useEffect } from 'react';
import { flightApi } from '../services/api';

const FlightList = () => {
    const [flights, setFlights] = useState([]);
    const [setEditingFlight] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadFlights();
    }, []);

    const loadFlights = async () => {
        try {
            setLoading(true);
            const response = await flightApi.getAllFlights();
            setFlights(response.data);
        } finally {
            setLoading(false);
        }
    };

    const getFlightStatus = (flight) => {
        const now = new Date();
        const departure = new Date(flight.departureTime);
        return now > departure ? 'Departed' : 'Scheduled';
    };

    return (
        <div className="section-container">
            <div className="section-header">
                <div className="status-badge status-active">
                    {flights.length} Active Flights
                </div>
            </div>



            {loading ? (
                <div className="loading-skeleton">Loading...</div>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Flight Number</th>
                                <th>From</th>
                                <th>To</th>
                                <th>Departure</th>
                                <th>Arrival</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {flights.map(flight => (
                                <tr key={flight.id}>
                                    <td>
                                        <span className="flight-number">
                                            {flight.flightNumber}
                                        </span>
                                    </td>
                                    <td>{flight.departureAirport.name}</td>
                                    <td>{flight.arrivalAirport.name}</td>
                                    <td>{new Date(flight.departureTime).toLocaleString()}</td>
                                    <td>{new Date(flight.arrivalTime).toLocaleString()}</td>
                                    <td>
                                        <span className={`status-badge status-${getFlightStatus(flight).toLowerCase()}`}>
                                            {getFlightStatus(flight)}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button 
                                                className="btn-edit"
                                                onClick={() => setEditingFlight(flight)}
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                className="btn-delete"
                                                onClick={() => {
                                                    flightApi.deleteFlight(flight.id);
                                                    setFlights(flights.filter(f => f.id !== flight.id));
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

export default FlightList;
