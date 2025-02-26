package com.airport.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.airport.model.Airport;
import com.airport.model.Bus;
import com.airport.model.Flight;
import com.airport.model.Route;
import com.airport.model.TransportSegment;
import com.airport.repository.AirportRepository;
import com.airport.repository.RouteRepository;

@Service
public class RouteOptimizationService {
    
    @Autowired
    private RouteRepository routeRepository;
    
    @Autowired
    private FlightService flightService;
    @Autowired
    private BusService busService;
    
    public List<Route> findRoutesBetweenAirports(String fromCity, String toCity, List<Airport> airports) {
        // Get existing direct routes
        List<Route> routes = routeRepository.findByStartPointAndEndPoint(fromCity, toCity);
        
        // Get all available flights and buses
        List<Flight> flights = flightService.findAll();
        List<Bus> buses = busService.findAll();
        
        // Find optimal routes combining both transport types
        List<Route> optimalRoutes = findOptimalRoutes(fromCity, toCity, flights, buses);
        
        // Combine direct and optimal routes
        routes.addAll(optimalRoutes);
        
        return routes;
    }



    public Route saveRoute(Route route) {
        return routeRepository.save(route);
    }

    public List<Route> findOptimalRoutes(String startPoint, String endPoint, 
                                       List<Flight> availableFlights, 
                                       List<Bus> availableBuses) {
        // Find direct routes from database
        List<Route> routes = routeRepository.findByStartPointAndEndPoint(startPoint, endPoint);
        
        routes.forEach(route -> {
            TransportSegment segment = new TransportSegment(
                route.getStartPoint(),
                route.getEndPoint(),
                "DIRECT",
                route.getTotalTime(),
                route.getTotalCost(),
                route.getId().toString()
            );
            route.addSegment(segment);
        });
        
        return routes;
    }
}