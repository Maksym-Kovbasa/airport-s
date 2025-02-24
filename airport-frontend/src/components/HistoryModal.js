import React from 'react';

const HistoryModal = ({ history, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>Flight and Bus History</h2>
        {history.map((entry, index) => (
          <div key={index} className="history-entry">
            <h3>Distribution #{index + 1} - {entry.timestamp}</h3>
            <div className="history-details">
              <div className="flights">
                <h4>Flights:</h4>
                {entry.planes.map(plane => (
                  <div key={plane.id} className="history-plane">
                    <p>Flight to {plane.destination}: {plane.families.reduce((acc, f) => acc + f.count, 0)} passengers</p>
                  </div>
                ))}
              </div>
              <div className="buses">
                <h4>Buses:</h4>
                {entry.buses.map((bus, busIndex) => (
                  <div key={busIndex} className="history-bus">
                    <p>Bus to {bus.destination}: {bus.currentCapacity} passengers</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryModal;
