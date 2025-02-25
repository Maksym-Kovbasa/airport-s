import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export const airportApi = {
    getAllAirports: () => axios.get(`${API_BASE_URL}/airports`),
    createAirport: (airport) => axios.post(`${API_BASE_URL}/airports`, airport),
    updateAirport: (id, airport) => axios.put(`${API_BASE_URL}/airports/${id}`, airport),
    deleteAirport: (id) => axios.delete(`${API_BASE_URL}/airports/${id}`)
};

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
