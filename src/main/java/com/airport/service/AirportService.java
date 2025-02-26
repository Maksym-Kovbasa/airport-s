package com.airport.service;

import com.airport.model.Airport;
import com.airport.repository.AirportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AirportService {
    @Autowired
    private AirportRepository airportRepository;

    public List<Airport> getAllAirports() {
        return airportRepository.findAll();
    }

    public Airport saveAirport(Airport airport) {
        return airportRepository.save(airport);
    }

    public Airport updateAirport(Long id, Airport airport) {
        Airport existingAirport = airportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Airport not found"));

        existingAirport.setName(airport.getName());
        existingAirport.setCode(airport.getCode());
        existingAirport.setCity(airport.getCity());
        existingAirport.setCountry(airport.getCountry());
        existingAirport.setLatitude(airport.getLatitude());
        existingAirport.setLongitude(airport.getLongitude());

        return airportRepository.save(existingAirport);
    }

    public void deleteAirport(Long id) {
        Airport airport = airportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Airport not found"));
        airportRepository.delete(airport);
    }

}
