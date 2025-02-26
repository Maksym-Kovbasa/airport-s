package com.airport.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;


@Entity
public class Route {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "start_point")
    private String startPoint;
    
    @Column(name = "end_point")
    private String endPoint;
    
    @Column(name = "cost")
    private double cost = 0.0;
    
    @Column(name = "duration")
    private int duration = 0;
    
    @Transient
    private List<TransportSegment> segments = new ArrayList<>();
    
    @Column(name = "total_cost")
    private double totalCost = 0.0;
    
    @Column(name = "total_time")
    private int totalTime = 0;

    public double getCost() {
        return cost;
    }

    public void setCost(double cost) {
        this.cost = cost;
    }

    public int getDuration() {
        return duration;
    }

    public void setDuration(int duration) {
        this.duration = duration;
    }
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStartPoint() {
        return startPoint;
    }

    public void setStartPoint(String startPoint) {
        this.startPoint = startPoint;
    }

    public String getEndPoint() {
        return endPoint;
    }

    public void setEndPoint(String endPoint) {
        this.endPoint = endPoint;
    }

    public List<TransportSegment> getSegments() {
        return segments;
    }

    public void setSegments(List<TransportSegment> segments) {
        this.segments = segments;
    }

    public void setTotalCost(double totalCost) {
        this.totalCost = totalCost;
    }

    public int getTotalTime() {
        return totalTime;
    }

    public void setTotalTime(int totalTime) {
        this.totalTime = totalTime;
    }

    public Route(String startPoint, String endPoint) {
        this.startPoint = startPoint;
        this.endPoint = endPoint;
        this.segments = new ArrayList<>();
        this.totalCost = 0.0;
        this.totalTime = 0;
    }

    public double getTotalCost() {
        return this.totalCost;
    }

    public Route() {}

    public void addSegment(TransportSegment segment) {
        segments.add(segment);
    }
}