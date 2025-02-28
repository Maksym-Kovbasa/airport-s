package com.airport.service;

import com.airport.model.Airport;
import com.airport.model.OpenCageResponse;
import com.airport.repository.AirportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Random;
import java.util.stream.Collectors;

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

    private final String OPENCAGE_API_KEY = "Your_Api_Key"; // Replace with your real API key
    private final RestTemplate restTemplate = new RestTemplate();
    
    public Map<String, List<String>> getAirportsWithNearbyCities(int radiusKm) {
        Map<String, List<String>> airportCities = new HashMap<>();
        List<Airport> airports = airportRepository.findAll();
        
        for (Airport airport : airports) {
            try {
                List<String> nearbyCities = generateRandomNearbyCities(airport, radiusKm);
                airportCities.put(airport.getName(), nearbyCities);
            } catch (Exception e) {
                // Fallback: use default cities if API call fails
                airportCities.put(airport.getName(), Arrays.asList(
                    airport.getCity(), 
                    "Nearby City 1", 
                    "Nearby City 2", 
                    "Nearby City 3"
                ));
            }
        }
        return airportCities;
    }

    private List<String> generateRandomNearbyCities(Airport airport, int radiusKm) {
        List<String> cities = new ArrayList<>();
        Random random = new Random();
        
        for (int i = 0; i < 3; i++) {
            // Generate random point within radiusKm of airport
            double r = radiusKm * Math.sqrt(random.nextDouble());
            double theta = random.nextDouble() * 2 * Math.PI;
            
            double lat = airport.getLatitude() + (r * Math.cos(theta) / 111.32);
            double lon = airport.getLongitude() + (r * Math.sin(theta) / (111.32 * Math.cos(airport.getLatitude())));
            
            // Get city name from coordinates using OpenCage reverse geocoding
            String url = String.format(
                "https://api.opencagedata.com/geocode/v1/json?q=%f+%f&key=%s&limit=1",
                lat, lon, OPENCAGE_API_KEY
            );
            
            ResponseEntity<OpenCageResponse> response = restTemplate.getForEntity(url, OpenCageResponse.class);
            String cityName = response.getBody().getResults().get(0).getComponents().getCity();
            cities.add(cityName != null ? cityName : airport.getCity());
        }
        
        cities.add(airport.getCity());
        return cities;
    }}