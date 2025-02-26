import React, { useState, useRef } from 'react';
import './App.css';
import HistoryModal from './components/HistoryModal';
import AirplaneAnimation from "./components/AirplaneAnimation";
import BusAnimation from "./components/BusAnimation";
import Dashboard from './components/Dashboard';
import { airportApi, historyApi } from './services/api';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import RouteSearch from './components/RouteSearch';




function App() {
    const [planes, setPlanes] = useState([]);
    const [numberOfPlanes, setNumberOfPlanes] = useState(1);
    const [busResults, setBusResults] = useState(null);
    const [history, setHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);
    const [loadingStates, setLoadingStates] = useState({});
    const [showAnimation, setShowAnimation] = useState(false);
    const [showBusAnimation, setShowBusAnimation] = useState(false);
    const [isAutoFilled, setIsAutoFilled] = useState(false);
    const [showDashboard, setShowDashboard] = useState(false);

    const autoFillPlane = async (planeId) => {
        setLoadingStates(prev => ({ ...prev, [planeId]: true }));
        const plane = planes.find(p => p.id === planeId);
        const currentPassengers = plane.families.reduce((acc, family) => acc + family.count, 0);

        try {
            const response = await fetch(`http://localhost:8080/api/planes/autofill/${planeId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ currentPassengers }),
            });

            const data = await response.json();
            const familiesWithUniqueIds = data.families.map((family, index) => ({
                ...family,
                id: `family-${planeId}-${family.name}-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`
            }));

            setPlanes(prevPlanes =>
                prevPlanes.map(plane => {
                    if (plane.id === planeId) {
                        return {
                            ...plane,
                            families: [...plane.families, ...familiesWithUniqueIds]
                        };
                    }
                    return plane;
                })
            );
        } catch (error) {
            console.error('Error auto-filling plane:', error);
        } finally {
            setLoadingStates(prev => ({ ...prev, [planeId]: false }));
        }
        setShowAnimation(true);
        setIsAutoFilled(true);
        setTimeout(() => {
            setShowAnimation(false);
        }, 10000);
    };


    const createPlanes = async () => {
        try {
            const response = await airportApi.getAllAirports();
            const airports = response.data;

            const newPlanes = Array.from({ length: numberOfPlanes }, (_, index) => {
                const randomAirportIndex = Math.floor(Math.random() * airports.length);
                return {
                    id: index + 1,
                    families: [],
                    departureAirport: airports[randomAirportIndex],
                    destination: airports[randomAirportIndex].city
                };
            });

            setPlanes(newPlanes);

        } catch (error) {
            console.error('Error creating planes:', error);
        }
    };

    const sortPassengersIntoBuses = async () => {
        setTimeout(() => {
            scrollToBusDistribution();
        }, 100);
        setShowBusAnimation(true);
        setIsAutoFilled(false);
        setTimeout(() => {
            setShowBusAnimation(false);
        }, 10000);
        try {
            const response = await fetch('http://localhost:8080/api/buses/distribute', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    planes: planes.map(plane => ({
                        departurePoint: plane.departureAirport.name,
                        families: plane.families.map(family => ({
                            name: family.name,
                            count: family.count,
                            travelTo: family.travelTo || plane.destination,
                            fromCity: plane.departureAirport.name
                        }))
                    }))
                }),
            });

            const data = await response.json();
            setBusResults(data.buses);

            // Process bus history
            for (const bus of data.buses) {
                const busHistory = {
                    destination: bus.destination,
                    passengerCount: bus.currentCapacity,
                    departureTime: new Date(),
                    passengers: bus.passengers
                };
                await historyApi.saveBusHistory(busHistory);
            }

            // Process flight history
            for (const plane of planes) {
                const flightHistory = {
                    flightNumber: `FL${plane.id}`,
                    departureAirport: plane.departureAirport.name || plane.departureAirport,
                    arrivalAirport: plane.destination,
                    departureTime: new Date().toISOString(),
                    arrivalTime: new Date(Date.now() + 3600000).toISOString(),
                    passengers: plane.families.map(family => ({
                        id: null,
                        name: family.name,
                        count: family.count,
                        fromCity: plane.departureAirport.name || plane.departureAirport,
                        travelTo: family.travelTo || plane.destination
                    }))
                };
                await historyApi.saveFlightHistory(flightHistory);
            }
        } catch (error) {
            console.error('Error:', error.response?.data || error.message);
        }
    };

    const busDistributionRef = useRef(null);

    const scrollToBusDistribution = () => {
        if (busDistributionRef.current) {
            const offset = 50;
            const elementPosition = busDistributionRef.current.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>Airport Management System</h1>
                <button className="dashboard-toggle" onClick={() => setShowDashboard(!showDashboard)}>
                    {showDashboard ? 'Show Plane Creation' : 'Show Dashboard'}
                </button>
            </header>
            <main className="App-main">
                <div className="app">
                   
                        <RouteSearch />
                   
                </div>
                {showDashboard ? (<Dashboard />) : (<>
                    <div className="control-panel">
                        <div className="setup-section">
                            <label htmlFor="numberOfPlanes">Number of Planes:</label>
                            <div className="plane-setup">
                                <label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="10"
                                        value={numberOfPlanes}
                                        onChange={(e) => setNumberOfPlanes(parseInt(e.target.value))}
                                    />
                                </label>
                                <button className="CreatePlane" onClick={createPlanes}>Create Planes</button>
                            </div>
                            <div className="history-section">
                                <button className="history-button" onClick={() => setShowHistory(true)}>
                                    Show History
                                </button>
                            </div>
                        </div>
                        <div className="planes-container">
                            {planes.map((plane) => {
                                const totalPassengers = plane.families.reduce((acc, family) => acc + family.count, 0);
                                return (
                                    <div key={plane.id} className="plane-card">
                                        <h3>Plane #{plane.id} - {plane.departureAirport.name}</h3>
                                        <div className="plane-destination">
                                            <label>Departure Point:</label>
                                            <span className="departure-point">{plane.destination}</span>
                                        </div>
                                        <div className="plane-buttons">
                                            <button className="fill-plane-button"
                                                onClick={() => autoFillPlane(plane.id)}
                                                disabled={totalPassengers >= 100 || loadingStates[plane.id]}
                                            >
                                                {loadingStates[plane.id] ? 'Filling...' : 'Fill Plane'}
                                            </button>
                                        </div>
                                        <p>Total Passengers: {totalPassengers}</p>
                                        {/* Rest of your plane card content */}
                                        <div className="families-table-container">
                                            <table className="families-table">
                                                <thead>
                                                    <tr>
                                                        <th>Family Name</th>
                                                        <th>Members</th>
                                                        <th>Destination</th>
                                                    </tr>
                                                </thead>
                                            </table>
                                            <div className="families-table-body">
                                                <table className="families-table">
                                                    <tbody>
                                                        {plane.families.map((family, index) => {
                                                            const uniqueKey = `family-${plane.id}-${family.name}-${index}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
                                                            return (
                                                                <tr key={uniqueKey}>
                                                                    <td>{family.name}</td>
                                                                    <td>{family.count}</td>
                                                                    <td>{family.travelTo}</td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        {planes.length > 0 && planes.every(plane =>
                            plane.families.reduce((acc, family) => acc + family.count, 0) === 100 &&
                            plane.destination
                        ) && (
                                <div ref={busDistributionRef} className="sort-button-container">
                                    {showBusAnimation && showBusAnimation && (<div className="sort-button-container"> <BusAnimation onAnimationEnd={() => setShowBusAnimation(false)} /> </div>)}
                                    <button className="sort-button"
                                        onClick={sortPassengersIntoBuses}>Sort Passengers into Buses
                                    </button>
                                    {showBusAnimation && showBusAnimation && (<div className="sort-button-container"><BusAnimation onAnimationEnd={() => setShowBusAnimation(false)} /></div>)}
                                </div>
                            )}
                        {busResults && (
                            <div className="bus-distribution">
                                <h2>Bus Distribution Results</h2>
                                <div className="bus-grid">
                                    {busResults.map((bus, index) => (
                                        <div key={`bus-${index}-${bus.destination}`} className="bus-card">
                                            <div className="bus-header">
                                                <h3>Bus to {bus.destination}</h3>
                                                <span className="passenger-count">
                                                    {bus.currentCapacity} passengers
                                                </span>
                                            </div>
                                            <div className="passenger-list">
                                                {bus.passengers.map((family) => (
                                                    <div key={`family-${family.name}-${family.planeId}`} className="passenger-item">
                                                        <span className="family-name">Family {family.name}</span>
                                                        <span className="member-count">{family.count} members</span>
                                                        <span className="from-city">From: {family.fromCity}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    {showHistory && (
                        <HistoryModal history={history} onClose={() => setShowHistory(false)} />
                    )}
                    {showAnimation && (
                        <AirplaneAnimation onAnimationEnd={() => setShowAnimation(false)} />
                    )}
                </>
                )}
            </main>
        </div>
    );
}

export default App;