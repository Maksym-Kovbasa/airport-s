package com.airport.service;

import com.airport.model.Flight;
import com.airport.repository.FlightRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FlightService {
    @Autowired
    private FlightRepository flightRepository;
    
    public List<Flight> getAllFlights() {
        return flightRepository.findAll();
    }
    
    public Flight saveFlight(Flight flight) {
        return flightRepository.save(flight);
    }
    
    public void deleteFlight(Long id) {
        Flight flight = flightRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Flight not found"));
        flightRepository.delete(flight);
    }
    public Flight updateFlight(Long id, Flight flight) {
        Flight existingFlight = flightRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Flight not found"));
        
        existingFlight.setFlightNumber(flight.getFlightNumber());
        existingFlight.setDepartureAirport(flight.getDepartureAirport());
        existingFlight.setArrivalAirport(flight.getArrivalAirport());
        existingFlight.setDepartureTime(flight.getDepartureTime());
        existingFlight.setArrivalTime(flight.getArrivalTime());
        
        return flightRepository.save(existingFlight);
    }
}


