package com.example.airport.model;

import java.util.ArrayList;
import java.util.List;

public class Bus {
    private String destination;
    private List<Family> passengers;
    private int currentCapacity;

    public Bus(String destination) {
        this.destination = destination;
        this.passengers = new ArrayList<>();
        this.currentCapacity = 0;
    }

    public void addFamily(Family family) {
        passengers.add(family);
        currentCapacity += family.getCount();
    }

    public String getDestination() {
        return destination;
    }

    public List<Family> getPassengers() {
        return passengers;
    }

    public int getCurrentCapacity() {
        return currentCapacity;
    }
}