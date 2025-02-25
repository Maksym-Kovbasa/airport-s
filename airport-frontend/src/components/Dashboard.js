import React, { useState } from 'react';
import AirportList from './AirportList';
import FlightList from './FlightList';

const Dashboard = () => {
    const [activeTab] = useState('airports');

    return (
        <div className="dashboard-container"> 
            <div className="dashboard">
                {activeTab === 'airports' ? (
                    <div className="card">
                        <AirportList />
                    </div>
                ) : (
                    <div className="card">
                        <FlightList />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
