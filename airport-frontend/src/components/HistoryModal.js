import React, { useState, useEffect } from 'react';
import { historyApi } from '../services/api';
import './style/HistoryModal.css';

const HistoryModal = ({ onClose }) => {
    const [flightHistory, setFlightHistory] = useState([]);
    const [busHistory, setBusHistory] = useState([]);
    const [activeTab, setActiveTab] = useState('flights');

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            const flightResponse = await historyApi.getAllFlightHistory();
            const busResponse = await historyApi.getAllBusHistory();
            
            console.log('Flight History:', flightResponse.data); // For debugging
            console.log('Bus History:', busResponse.data); // For debugging
            
            setFlightHistory(flightResponse.data || []);
            setBusHistory(busResponse.data || []);
        } catch (error) {
            console.error('Error loading history:', error);
        }
    };

    const clearHistory = async () => {
      if (window.confirm('Are you sure you want to clear all history?')) {
          try {
              await historyApi.clearBusHistory();
              await historyApi.clearFlightHistory();
              await loadHistory();
          } catch (error) {
              console.error('Error clearing history:', error);
          }
      }
  };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>History</h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>
                
                <div className="history-tabs">
                  <div>
                    <button 
                        className={`tab ${activeTab === 'flights' ? 'active' : ''}`}
                        onClick={() => setActiveTab('flights')}
                    >
                        Flight History ({flightHistory.length})
                    </button>
                  </div>
                  <div>
                    <button 
                        className={`tab ${activeTab === 'buses' ? 'active' : ''}`}
                        onClick={() => setActiveTab('buses')}
                    >
                        Bus History ({busHistory.length})
                    </button>
                  </div>
                  <div>
                    <button className="clear-button" onClick={clearHistory}>
                            Clear History
                    </button>
                  </div>
                </div>

                <div className="history-content">
                    {activeTab === 'flights' && (
                        <div className="history-list">
                            {flightHistory.map((flight, index) => (
                                <div key={`flight-${index}`} className="history-item">
                                    <h4>Flight {flight.flightNumber}</h4>
                                    <div className="flight-details">
                                        <p><strong>From:</strong> {flight.departureAirport}</p>
                                        <p><strong>To:</strong> {flight.arrivalAirport}</p>
                                        <p><strong>Departure:</strong> {new Date(flight.departureTime).toLocaleString()}</p>
                                        <p><strong>Recorded:</strong> {new Date(flight.recordedAt).toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {activeTab === 'buses' && (
                        <div className="history-list">
                            {busHistory.map((bus, index) => (
                                <div key={`bus-${index}`} className="history-item">
                                    <h4>Bus to {bus.destination}</h4>
                                    <div className="bus-details">
                                        <p><strong>Passengers:</strong> {bus.passengerCount}</p>
                                        <p><strong>Departure:</strong> {new Date(bus.departureTime).toLocaleString()}</p>
                                        <p><strong>Recorded:</strong> {new Date(bus.recordedAt).toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HistoryModal;