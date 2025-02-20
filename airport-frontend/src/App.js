import React, { useState } from 'react';
import './App.css';

function App() {
  const [planes, setPlanes] = useState([]);
  const [numberOfPlanes, setNumberOfPlanes] = useState(1);
  const [busResults, setBusResults] = useState(null);


// Replace single loading state with a map of loading states per plane
const [loadingStates, setLoadingStates] = useState({});

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
        
        setPlanes(prevPlanes =>
            prevPlanes.map(plane => {
                if (plane.id === planeId) {
                    return { 
                        ...plane, 
                        families: [...plane.families, ...data.families]
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
};




  const generateFamilyName = () => {
      const letters = 'abcdefghijklmnopqrstuvwxyz';
      return letters[Math.floor(Math.random() * 26)] + letters[Math.floor(Math.random() * 26)];
  };

  const addFamily = (planeId) => {
      setPlanes(prevPlanes =>
          prevPlanes.map(plane => {
              if (plane.id === planeId) {
                  const totalPassengers = plane.families.reduce((acc, family) => acc + family.count, 0);
                  if (totalPassengers >= 100) return plane;
                  const uniqueId = `family-${planeId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                  const newFamily = {
                      id: uniqueId,
                      name: generateFamilyName(),
                      travelTo: "Kalush",
                      count: 1,
                      planeId: planeId,
                  };
                  return { ...plane, families: [...plane.families, newFamily] };
              }
              return plane;
          })
      );
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
    } catch (error) {
        console.error('Error distributing passengers:', error);
    }
};





  return (
      <div className="App">
          <header className="App-header">
              <h1>Airport Simulation Dashboard</h1>
          </header>
          <main className="App-main">
              <div className="control-panel">
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
                                          onClick={() => addFamily(plane.id)}
                                          disabled={totalPassengers >= 100}
                                      >
                                          Add Family
                                      </button>
                                      <button 
                                            onClick={() => autoFillPlane(plane.id)}
                                            disabled={totalPassengers >= 100 || loadingStates[plane.id]}
                                        >
                                            {loadingStates[plane.id] ? 'Filling...' : 'Auto Fill Plane'}
                                        </button>
                                  </div>
                                  <p>Total Passengers: {totalPassengers}</p>
                                  {/* Rest of your plane card content */}
                              </div>
                          );
                      })}
                  </div>
                  {planes.length > 0 && planes.every(plane => 
                      plane.families.reduce((acc, family) => acc + family.count, 0) === 100 && 
                      plane.destination
                  ) && (
                      <div className="sort-button-container">
                          <button className="sort-button"
                            onClick={sortPassengersIntoBuses}>Sort Passengers into Buses</button>
                      </div>
                  )}
                      {busResults && (
                          <div className="bus-distribution">
                              <h2>Bus Distribution Results</h2>
                              <div className="bus-grid">
                                  {busResults.map((bus, index) => (
                                      <div key={index} className="bus-card">
                                          <div className="bus-header">
                                              <h3>Bus to {bus.destination}</h3>
                                              <span className="passenger-count">
                                                  {bus.currentCapacity} passengers
                                              </span>
                                          </div>
                                          <div className="passenger-list">
                                              {bus.passengers.map((family, fIndex) => (
                                                  <div key={fIndex} className="passenger-item">
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
                                </main>
                            </div>
  );
}
export default App;