package com.airport.model;

import java.util.ArrayList;
import java.util.List;

public class Bus {
    private String destination;
    List<Family> passengers;
    private int currentCapacity;
    public int passengersCount;
    public String driveTo;

    public Bus(String destination) {
        this.destination = destination;
        this.passengers = new ArrayList<>();
        this.currentCapacity = 0;
    }

    public Bus(int passengersCount, String driveTo) {
        this.passengersCount = passengersCount;
        this.driveTo = driveTo;
        this.passengers = new ArrayList<>();
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