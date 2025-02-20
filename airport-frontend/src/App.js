import React, { useState } from 'react';
import './App.css';

function App() {
  const [planes, setPlanes] = useState([]);
  const [numberOfPlanes, setNumberOfPlanes] = useState(1);
  const [busResults, setBusResults] = useState(null);


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

  const autoFillPlane = (planeId) => {
      setPlanes(prevPlanes =>
          prevPlanes.map(plane => {
              if (plane.id === planeId) {
                  let totalPassengers = plane.families.reduce((acc, family) => acc + family.count, 0);
                  const newFamilies = [];
                  const destinations = ["Kalush", "Kosiv", "Galych", "Kolomiya"];

                  while (totalPassengers < 100) {
                      let newCount = Math.floor(Math.random() * 4) + 1;
                      if (totalPassengers + newCount > 100) {
                          newCount = 100 - totalPassengers;
                      }
                      if (newCount === 0) break;

                      const uniqueId = `family-${planeId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                      const randomDestination = destinations[Math.floor(Math.random() * destinations.length)];
                      const newFamily = {
                          id: uniqueId,
                          name: generateFamilyName(),
                          travelTo: randomDestination,
                          count: newCount,
                          planeId: planeId,
                      };

                      newFamilies.push(newFamily);
                      totalPassengers += newCount;
                  }
                  return { ...plane, families: [...plane.families, ...newFamilies] };
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

  const sortPassengersIntoBuses = () => {
      // Initialize bus routes with arrays to hold multiple buses
      let busRoutes = {
          'Kalush': [],
          'Kosiv': [],
          'Galych': [],
          'Kolomiya': []
      };

      // Create initial bus for each route
      Object.keys(busRoutes).forEach(destination => {
          busRoutes[destination].push({
              destination,
              capacity: 100,
              currentCapacity: 0,
              passengers: []
          });
      });

      planes.forEach(plane => {
          plane.families.forEach(family => {
              const route = busRoutes[family.travelTo];
              let currentBus = route[route.length - 1];

              // If current bus is full, create a new one
              if (currentBus.currentCapacity + family.count > currentBus.capacity) {
                  currentBus = {
                      destination: family.travelTo,
                      capacity: 100,
                      currentCapacity: 0,
                      passengers: []
                  };
                  route.push(currentBus);
              }

              currentBus.passengers.push({
                  name: family.name,
                  count: family.count,
                  fromCity: plane.destination
              });
              currentBus.currentCapacity += family.count;
          });
      });

      // Flatten all buses into a single array for display
      const allBuses = Object.values(busRoutes)
          .flat()
          .filter(bus => bus.currentCapacity > 0);

      setBusResults(allBuses);
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
                                          disabled={totalPassengers >= 100}
                                      >
                                          Auto Fill Plane
                                      </button>
                                  </div>
                                  <p>Total Passengers: {totalPassengers}</p>
                                  <div className="families-list">
                                      {plane.families.map((family) => (
                                          <div key={family.id} className="family-item">
                                              <span>Family {family.name}</span>
                                              <select 
                                                  value={family.travelTo}
                                                  onChange={(e) => {
                                                      setPlanes(currentPlanes =>
                                                          currentPlanes.map(p => {
                                                              if (p.id === family.planeId) {
                                                                  return {
                                                                      ...p,
                                                                      families: p.families.map(f =>
                                                                          f.id === family.id ? { ...f, travelTo: e.target.value } : f
                                                                      ),
                                                                  };
                                                              }
                                                              return p;
                                                          })
                                                      );
                                                  }}
                                              >
                                                  <option value="Kalush">Kalush</option>
                                                  <option value="Kosiv">Kosiv</option>
                                                  <option value="Galych">Galych</option>
                                                  <option value="Kolomiya">Kolomiya</option>
                                              </select>
                                              <input 
                                                  type="number"
                                                  min="1"
                                                  max="4"
                                                  value={family.count}
                                                  onChange={(e) => {
                                                      const newCount = parseInt(e.target.value) || 0;
                                                      setPlanes(currentPlanes =>
                                                          currentPlanes.map(p => {
                                                              if (p.id === family.planeId) {
                                                                  const otherPassengers = p.families.reduce((acc, f) => 
                                                                      f.id === family.id ? acc : acc + f.count, 0);
                                                                  const available = 100 - otherPassengers;
                                                                  const finalCount = newCount > available ? available : newCount;
                                                                  return {
                                                                      ...p,
                                                                      families: p.families.map(f =>
                                                                          f.id === family.id ? { ...f, count: finalCount } : f
                                                                      ),
                                                                  };
                                                              }
                                                              return p;
                                                          })
                                                      );
                                                  }}
                                              />
                                          </div>
                                      ))}
                                  </div>
                              </div>
                          );
                      })}
                  </div>
                  {planes.length > 0 && planes.every(plane => 
                      plane.families.reduce((acc, family) => acc + family.count, 0) === 100 && 
                      plane.destination
                  ) && (
                      <div className="sort-button-container">
                          <button 
                              className="sort-button"
                              onClick={sortPassengersIntoBuses}
                          >
                              Sort Passengers into Buses
                          </button>
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