package com.airport.model;

public class Family {
    public String name;
    public String travelTo;
    public int count;
    public int planeId;

    public Family(String name, String travelTo, int count, int planeId) {
        this.name = name;
        this.travelTo = travelTo;
        this.count = count;
        this.planeId = planeId;
    }
}
