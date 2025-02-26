package com.airport.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "buses")
public class Bus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String id;
    private String startCity;
    private int duration;
    private double cost;

    
    @OneToMany
    @JoinColumn(name = "bus_id")
    public List<Family> passengers;

    private String arrivalCity;

    public static final int MAX_CAPACITY = 38;
    private String destination;
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
        if (canAddFamily(family)) {
            passengers.add(family);
            currentCapacity += family.getCount();
        }
    }

    public boolean canAddFamily(Family family) {
        return currentCapacity + family.getCount() <= MAX_CAPACITY;
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

    // Getters and setters
    public String getId() {
        return id;
    }

    public String getStartCity() {
        return startCity;
    }

    public int getDuration() {
        return duration;
    }

    public double getCost() {
        return cost;
    }


    public Bus() {
    }

    public String getArrivalCity() {
        return arrivalCity;
    }

}
