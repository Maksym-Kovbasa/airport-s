package com.airport.controller;

import com.airport.model.Airport;
import com.airport.repository.AirportRepository;
import com.airport.service.AirportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/airports")
public class AirportController {

    @Autowired
    private AirportRepository airportRepository;

    @PostMapping
    public ResponseEntity<Airport> addAirport(@RequestBody Airport airport) {
        return ResponseEntity.ok(airportRepository.save(airport));
    }

    @GetMapping
    public ResponseEntity<List<Airport>> getAllAirports() {
        return ResponseEntity.ok(airportRepository.findAll());
    }

    @Autowired
    private AirportService airportService;

    @PutMapping("/{id}")
    public ResponseEntity<Airport> updateAirport(@PathVariable Long id, @RequestBody Airport airport) {
        Airport updatedAirport = airportService.updateAirport(id, airport);
        return ResponseEntity.ok(updatedAirport);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAirport(@PathVariable Long id) {
        airportService.deleteAirport(id);
        return ResponseEntity.ok().build();
    }

}
