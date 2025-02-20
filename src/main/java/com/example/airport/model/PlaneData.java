package com.example.airport.model;

import java.util.List;

public class PlaneData {
    private String departurePoint;
    private List<Family> families;

    // Getters and setters
    public String getDeparturePoint() {
        return departurePoint;
    }

    public void setDeparturePoint(String departurePoint) {
        this.departurePoint = departurePoint;
    }

    public List<Family> getFamilies() {
        return families;
    }

    public void setFamilies(List<Family> families) {
        this.families = families;
    }
}
