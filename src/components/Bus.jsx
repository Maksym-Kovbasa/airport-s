import React from 'react';
import './Bus.css';

const Bus = ({ bus }) => {
    return (
        <div className="bus-container">
            <h3>Bus to {bus.driveTo}</h3>
            <div className="bus-info">
                <span>Capacity: {bus.passengersCount}</span>
                <div className="passengers-list">
                    {bus.passengers.map((family, index) => (
                        <div key={index} className="passenger-item">
                            <span>Family {family.name}</span>
                            <span>({family.count} members)</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Bus;
