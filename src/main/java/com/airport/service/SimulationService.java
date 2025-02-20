package com.airport.service;

import com.airport.model.*;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SimulationService {
    private final Controller controller;

    public SimulationService() {
        this.controller = new Controller(new Model(), new View());
    }

    public List<Bus> runSimulation() throws InterruptedException {
        String directoryPathInput = "src/main/resources/Planes";
        controller.process(directoryPathInput);
        return controller.getModel().getBuses();
    }
}