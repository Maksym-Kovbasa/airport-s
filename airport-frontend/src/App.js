import React, { useState, useRef } from 'react';
import './App.css';
import HistoryModal from './components/HistoryModal';
import AirplaneAnimation from "./AirplaneAnimation";
import BusAnimation from "./BusAnimation"; 

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
        const familiesWithUniqueIds = data.families.map(family => ({
            ...family,
            id: `family-${planeId}-${family.name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
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

  const createPlanes = () => {
      const destinations = ["London", "Paris", "New York", "Tokyo"];
      const newPlanes = Array.from({ length: numberOfPlanes }, (_, index) => ({
          id: index + 1,
          families: [],
          destination: destinations[index % destinations.length],
      }));
      setPlanes(newPlanes);
  };

  const sortPassengersIntoBuses = async () => {
    setTimeout(() => {
        scrollToBusDistribution();
    }, 100);
    try {
        const response = await fetch('http://localhost:8080/api/buses/distribute', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ planes }),
        });
        
        const data = await response.json();
        setBusResults(data.buses);

        // Add to history
        const historyEntry = {
            timestamp: new Date().toLocaleString(),
            planes: [...planes],
            buses: data.buses
        };
        setHistory(prev => [...prev, historyEntry]);
    } catch (error) {
        console.error('Error distributing passengers:', error);
    }
        setShowBusAnimation(true);
        setIsAutoFilled(false);
        setTimeout(() => {
            setShowBusAnimation(false);
        }, 10000);
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
              <h1>Airport Simulation Dashboard</h1>
          </header>
          <main className="App-main">
              <div className="control-panel">
                <div className="setup-section">
                  <div className="plane-setup">
                      <label>
                          Number of Planes:
                          <input 
                              type="number" 
                              min="1"
                              max="5"
                              value={numberOfPlanes}
                              onChange={(e) => setNumberOfPlanes(parseInt(e.target.value))}
                          />
                      </label>
                      <button onClick={createPlanes}>Create Planes</button>
                  </div>
                  <div className="history-section">
                        <button className="history-button" onClick={() => setShowHistory(true)}>Show History</button>
                        {showHistory && (<HistoryModal history={history} onClose={() => setShowHistory(false)}/>)}
                  </div>
                </div>
                  <div className="planes-container">
                      {planes.map((plane) => {
                          const totalPassengers = plane.families.reduce((acc, family) => acc + family.count, 0);
                          return (
                              <div key={plane.id} className="plane-card">
                                  <h3>Plane #{plane.id}</h3>
                                  <div className="plane-destination">
                                      <label>Departure Point:</label>
                                      <span className="departure-point">{plane.destination}</span>
                                  </div>
                                  <div className="plane-buttons">
                                      <button 
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
                                                    {plane.families.map((family, index) => (
                                                        <tr key={`family-${index}-${family.id}`}>
                                                            <td>{family.name}</td>
                                                            <td>{family.count}</td>
                                                            <td>{family.travelTo}</td>
                                                        </tr>
                                                    ))}
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
            {showAnimation && <AirplaneAnimation onAnimationEnd={() => setShowAnimation(false)} />}
        </main>
    </div>
  );
}
export default App;