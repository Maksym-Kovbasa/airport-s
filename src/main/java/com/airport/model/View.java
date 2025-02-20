package com.airport.model;

import java.util.Comparator;
import java.util.List;

public class View {
    public void printResults(List<Bus> buses) {
        buses.sort(Comparator.comparing(bus -> bus.driveTo));
        for (Bus bus : buses) {
            System.out.println(
                    "Bus went to " + bus.driveTo + " (Capacity: " + bus.passengersCount + "):");
            for (Family family : bus.passengers) {
                System.out.println(
                        "  Family " + family.name + " (" + family.count + " members), from Plane: " + family.planeId);
            }
        }
    }

    public void printError(String errorMessage) {
        System.out.println("Error: " + errorMessage);
    }
}
