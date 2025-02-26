package com.airport.model;

import jakarta.persistence.*;

@Entity
@Table(name = "families")
public class Family {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @Column(nullable = false)
    public String name;

    @Column(nullable = false) 
    public int count;

    @Column(name = "travel_to")
    public String travelTo;

    @Column(nullable = false)
    public int planeId;

    // Default constructor
    public Family() {
    }

    public Family(String name, String travelTo, int count, int planeId) {
        this.name = name;
        this.travelTo = travelTo;
        this.count = count;
        this.planeId = planeId;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getCount() {
        return count;
    }

    public void setCount(int count) {
        this.count = count;
    }

    public String getTravelTo() {
        return travelTo;
    }

    public void setTravelTo(String travelTo) {
        this.travelTo = travelTo;
    }

    private String fromCity;


    public String getFromCity() {
        return fromCity;
    }

    public void setFromCity(String fromCity) {
        this.fromCity = fromCity;
    }
}