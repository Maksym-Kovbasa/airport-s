package com.airport.model;

public class Family {
    public String name;
    public String travelTo;
    public int count;
    public int planeId;
    private String fromCity;

    public Family(String name, String travelTo, int count, int planeId) {
        this.name = name;
        this.travelTo = travelTo;
        this.count = count;
        this.planeId = planeId;
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

    public String getFromCity() {
        return fromCity;
    }

    public void setFromCity(String fromCity) {
        this.fromCity = fromCity;
    }
}
