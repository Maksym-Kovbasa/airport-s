package com.airport.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.airport.model.Bus;
import com.airport.model.Flight;
import com.airport.service.BusService;
import com.airport.service.FlightService;

@RestController
@RequestMapping("/api/transport")
public class TransportController {
    @Autowired
    private FlightService flightService;

    @Autowired
    private BusService busService;

    @PostMapping("/flights")
    public ResponseEntity<Flight> addFlight(@RequestBody Flight flight) {
        return ResponseEntity.ok(flightService.save(flight));
    }

    @PostMapping("/buses")
    public ResponseEntity<Bus> addBus(@RequestBody Bus bus) {
        return ResponseEntity.ok(busService.save(bus));
    }
}
