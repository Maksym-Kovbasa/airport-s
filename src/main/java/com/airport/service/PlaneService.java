package com.airport.service;

public class PlaneService {
    public void validatePlaneRoute(String departure, String destination) {
        if (departure.equals(destination)) {
            throw new IllegalArgumentException("Departure and destination airports cannot be the same");
        }
    }
    
}
