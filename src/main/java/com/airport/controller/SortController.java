package com.airport.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.airport.model.Bus;
import com.airport.model.PlaneData;
import java.util.List;
import jakarta.servlet.http.HttpServletResponse;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api")
public class SortController {
    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/api/sort-passengers")
    public ResponseEntity<List<Bus>> sortPassengers(@RequestBody List<PlaneData> planes, HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        List<Bus> sortedBuses = BusDistributor.distributePassengers(planes);
        return ResponseEntity.ok(sortedBuses);
    }
    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/sort-passengers")
    public ResponseEntity<String> getPassengers() {
        return ResponseEntity.ok("CORS policy applied");
    }
}
