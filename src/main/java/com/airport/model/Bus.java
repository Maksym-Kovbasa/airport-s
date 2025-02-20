package com.airport.model;

import java.util.ArrayList;
import java.util.List;

public class Bus {
    public int passengersCount;
    public String driveTo;
    public List<Family> passengers;

    public Bus(int passengersCount, String driveTo) {
        this.passengersCount = passengersCount;
        this.driveTo = driveTo;
        this.passengers = new ArrayList<>();
    }

    public void addFamily(Family family) {
        passengers.add(family);
    }
}
