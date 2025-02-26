package com.airport.controller;

import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.airport.model.Airport;
import com.airport.model.Bus;
import com.airport.model.Flight;
import com.airport.model.Route;
import com.airport.repository.AirportRepository;
import com.airport.repository.BusRepository;
import com.airport.repository.FlightRepository;
import com.airport.service.BusService;
import com.airport.service.FlightService;
import com.airport.service.RouteOptimizationService;

@RestController
@RequestMapping("/api/routes")
@CrossOrigin(origins = "http://localhost:3000")
public class RouteController {

    @Autowired
    private RouteOptimizationService routeService;

    @Autowired
    private AirportRepository airportRepository;
    @Autowired
    private FlightService flightService;

    @Autowired
    private BusService busService;

    @GetMapping("/optimize")
    public ResponseEntity<?> findRoutes(
            @RequestParam String from,
            @RequestParam String to) {
        try {
            // Get all available transport options
            List<Flight> flights = flightService.findAll();
            List<Bus> buses = busService.findAll();

            // Find optimal routes combining both transport types
            List<Route> routes = routeService.findOptimalRoutes(from, to, flights, buses);

            return ResponseEntity.ok(routes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(Collections.emptyList()); // Return empty list instead of error
        }
    }

    @PostMapping("/add")
    public ResponseEntity<Route> addRoute(@RequestBody Route route) {
        Route savedRoute = routeService.saveRoute(route);
        return ResponseEntity.ok(savedRoute);
    }
}
