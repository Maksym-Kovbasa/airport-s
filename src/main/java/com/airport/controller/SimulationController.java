package com.airport.controller;

import com.airport.model.Bus;
import com.airport.service.SimulationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/simulation")
@CrossOrigin(origins = "http://localhost:3000")
public class SimulationController {
    private final SimulationService simulationService;

    public SimulationController(SimulationService simulationService) {
        this.simulationService = simulationService;
    }

    @GetMapping("/run")
    public List<Bus> runSimulation() throws InterruptedException {
        return simulationService.runSimulation();
    }
}
