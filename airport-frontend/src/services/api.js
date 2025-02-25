import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';



export const flightApi = {
    getAllFlights: () => axios.get(`${API_BASE_URL}/flights`),
    createFlight: (flight) => axios.post(`${API_BASE_URL}/flights`, flight),
    updateFlight: (id, flight) => axios.put(`${API_BASE_URL}/flights/${id}`, flight),
    deleteFlight: (id) => axios.delete(`${API_BASE_URL}/flights/${id}`)
};

export const historyApi = {
    getAllFlightHistory: () => axios.get(`${API_BASE_URL}/history/flights`),
    saveFlightHistory: (history) => axios.post(`${API_BASE_URL}/history/flights`, history),
    getAllBusHistory: () => axios.get(`${API_BASE_URL}/history/buses`),
    saveBusHistory: (history) => axios.post(`${API_BASE_URL}/history/buses`, history),
    clearFlightHistory: () => axios.delete(`${API_BASE_URL}/history/flights`),
    clearBusHistory: () => axios.delete(`${API_BASE_URL}/history/buses`)
};

// Define the airport interface using JSDoc for better type checking
/**
 * @typedef {Object} Airport
 * @property {string} name - Airport name
 * @property {string} code - Airport code
 * @property {string} city - City name
 * @property {string} country - Country name
 * @property {number} latitude - Airport latitude
 * @property {number} longitude - Airport longitude
 */
export const airportApi = {
    getAllAirports: () => axios.get(`${API_BASE_URL}/airports`),
    createAirport: (airportData) => {
        const dataWithCoordinates = {
            ...airportData,
            latitude: Number(airportData.latitude),
            longitude: Number(airportData.longitude)
        };
        return axios.post(`${API_BASE_URL}/airports`, dataWithCoordinates);
    },
    updateAirport: (id, airportData) => {
        const dataWithCoordinates = {
            ...airportData,
            latitude: Number(airportData.latitude),
            longitude: Number(airportData.longitude)
        };
        return axios.put(`${API_BASE_URL}/airports/${id}`, dataWithCoordinates);
    },
    deleteAirport: (id) => axios.delete(`${API_BASE_URL}/airports/${id}`)
};