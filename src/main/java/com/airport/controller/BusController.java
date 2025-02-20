package com.airport.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.airport.model.Bus;
import com.airport.model.PlaneData;


@RestController
@RequestMapping("/api/buses")
@CrossOrigin(origins = "http://localhost:3000")
public class BusController {
    
    @PostMapping("/distribute")
    public ResponseEntity<Map<String, Object>> distributePassengers(@RequestBody Map<String, List<PlaneData>> request) {
        List<PlaneData> planes = request.get("planes");
        List<Bus> buses = BusDistributor.distributePassengers(planes);
        
        Map<String, Object> response = new HashMap<>();
        response.put("buses", buses);
        
        return ResponseEntity.ok(response);
    }
}
