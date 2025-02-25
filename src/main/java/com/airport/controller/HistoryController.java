package com.airport.controller;

import com.airport.model.BusHistory;
import com.airport.model.FlightHistory;
import com.airport.service.HistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/history")
@CrossOrigin(origins = "http://localhost:3000")
public class HistoryController {
    @Autowired
    private HistoryService historyService;

    @GetMapping("/flights")
    public ResponseEntity<List<FlightHistory>> getAllFlightHistory() {
        List<FlightHistory> history = historyService.getAllFlightHistory();
        System.out.println("Retrieved flight history: " + history);
        return ResponseEntity.ok(history);
    }

    @GetMapping("/buses")
    public ResponseEntity<List<BusHistory>> getAllBusHistory() {
        return ResponseEntity.ok(historyService.getAllBusHistory());
    }

    @PostMapping("/flights")
    public ResponseEntity<FlightHistory> saveFlightHistory(@RequestBody FlightHistory history) {
        return ResponseEntity.ok(historyService.saveFlightHistory(history));
    }

    @PostMapping("/buses")
    public ResponseEntity<BusHistory> saveBusHistory(@RequestBody BusHistory history) {
        return ResponseEntity.ok(historyService.saveBusHistory(history));
    }

    @DeleteMapping("/flights")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<String> clearFlightHistory() {
        try {
            historyService.clearFlightHistory();
            return ResponseEntity.ok("Flight history cleared successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to clear flight history: " + e.getMessage());
        }
    }

    @DeleteMapping("/buses")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<String> clearBusHistory() {
        try {
            historyService.clearBusHistory();
            return ResponseEntity.ok("Bus history cleared successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to clear bus history: " + e.getMessage());
        }
    }
}