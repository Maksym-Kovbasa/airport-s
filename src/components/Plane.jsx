import React from 'react';
import './Plane.css';

const Plane = ({ id, families }) => {
    return (
        <div className="plane-container">
            <h3>Plane #{id}</h3>
            <div className="families-list">
                {families.map((family, index) => (
                    <div key={index} className="family-item">
                        <span>Family {family.name}</span>
                        <span>Members: {family.count}</span>
                        <span>Destination: {family.travelTo}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Plane;
