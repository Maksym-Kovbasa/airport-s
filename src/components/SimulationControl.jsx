import React, { useState } from 'react';
import './SimulationControl.css';

const SimulationControl = () => {
    const [status, setStatus] = useState({
        activePlanes: [],
        inProgressBuses: [],
        completedTrips: 0,
        isRunning: false
    });

    const [simulationResults, setSimulationResults] = useState([]);

    const startSimulation = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/simulation/run');
            const data = await response.json();
            setSimulationResults(data);
        } catch (error) {
            console.error('Error running simulation:', error);
        }
    };

    return (
        <div className="dashboard">
            <div className="status-panel">
                <div className="status-card">
                    <h3>Active Planes</h3>
                    <div className="plane-indicators">
                        {status.activePlanes.map((plane, idx) => (
                            <div key={idx} className="plane-icon">✈️</div>
                        ))}
                    </div>
                </div>
                
                <div className="status-card">
                    <h3>Buses in Transit</h3>
                    <div className="bus-indicators">
                        {status.inProgressBuses.map((bus, idx) => (
                            <div key={idx} className="bus-icon">🚌</div>
                        ))}
                    </div>
                </div>
                
                <div className="status-card">
                    <h3>Completed Trips</h3>
                    <div className="counter">{status.completedTrips}</div>
                </div>
            </div>

            <div className="simulation-controls">
                <button 
                    className="control-btn primary"
                    onClick={startSimulation}
                >
                    Start New Simulation
                </button>
            </div>
        </div>
    );
};

export default SimulationControl;