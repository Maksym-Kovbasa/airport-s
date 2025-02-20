package com.example.airport.model;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class BusDistributor {
    public static List<Bus> distributePassengers(List<PlaneData> planes) {
        Map<String, List<Family>> destinationGroups = new HashMap<>();
        
        // Group families by destination
        for (PlaneData plane : planes) {
            for (Family family : plane.getFamilies()) {
                destinationGroups.computeIfAbsent(family.getTravelTo(), k -> new ArrayList<>())
                        .add(family);
            }
        }
        
        List<Bus> buses = new ArrayList<>();
        
        // Create buses for each destination
        for (Map.Entry<String, List<Family>> entry : destinationGroups.entrySet()) {
            String destination = entry.getKey();
            List<Family> families = entry.getValue();
            
            Bus currentBus = new Bus(destination);
            
            for (Family family : families) {
                if (currentBus.getCurrentCapacity() + family.getCount() > 50) {
                    buses.add(currentBus);
                    currentBus = new Bus(destination);
                }
                currentBus.addFamily(family);
            }
            
            if (currentBus.getCurrentCapacity() > 0) {
                buses.add(currentBus);
            }
        }
        
        return buses;
    }
}