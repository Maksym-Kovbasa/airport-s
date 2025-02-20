package com.airport.model;

import java.util.List;

public class Plane {
    public List<Family> families;
    public int id;

    public Plane(int id, List<Family> families) {
        this.id = id;
        this.families = families;
    }
}
