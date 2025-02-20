import React, { useState, useEffect } from 'react';

function Simulation() {
    const [buses, setBuses] = useState([]);
    const [loading, setLoading] = useState(false);

    const runSimulation = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8080/api/simulation/run');
            const data = await response.json();
            setBuses(data);
        } catch (error) {
            console.error('Error running simulation:', error);
        }
        setLoading(false);
    };

    return (
        <div>
            <h1>Airport Simulation</h1>
            <button onClick={runSimulation} disabled={loading}>
                {loading ? 'Running Simulation...' : 'Run Simulation'}
            </button>
            
            {buses.map((bus, index) => (
                <div key={index} className="bus-info">
                    <h3>Bus to {bus.driveTo} (Capacity: {bus.passengersCount})</h3>
                    <ul>
                        {bus.passengers.map((family, fIndex) => (
                            <li key={fIndex}>
                                Family {family.name} ({family.count} members) from Plane {family.planeId}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}

export default Simulation;
