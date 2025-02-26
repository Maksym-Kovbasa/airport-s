package com.airport.model;

import jakarta.persistence.*;

@Entity
@Table(name = "transport_segments")
public class TransportSegment {
    @Id
    @GeneratedValue
    private Long id;
    private String from;
    private String to;
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


    private String transportType; // "FLIGHT" or "BUS"
    private int duration;
    private double cost;
    private String transportId; // flightNumber or busId

    @Column(name = "departure_point")  // instead of "from"
    private String departurePoint;
    
    @Column(name = "arrival_point")    // instead of "to" 
    private String arrivalPoint;

    public TransportSegment(String from, String to, String transportType,
            int duration, double cost, String transportId) {
        this.from = from;
        this.to = to;
        this.transportType = transportType;
        this.duration = duration;
        this.cost = cost;
        this.transportId = transportId;
    }

    public double getCost() {
        // TODO: implement the cost calculation logic
        return cost;
    }

    public int getDuration() {
        return duration;
    }

    public String getFrom() {
        return from;
    }

    public void setFrom(String from) {
        this.from = from;
    }

    public String getTo() {
        return to;
    }

    public void setTo(String to) {
        this.to = to;
    }

    public String getTransportType() {
        return transportType;
    }

    public void setTransportType(String transportType) {
        this.transportType = transportType;
    }

    public void setDuration(int duration) {
        this.duration = duration;
    }

    public void setCost(double cost) {
        this.cost = cost;
    }

    public String getTransportId() {
        return transportId;
    }

    public void setTransportId(String transportId) {
        this.transportId = transportId;
    }

}
