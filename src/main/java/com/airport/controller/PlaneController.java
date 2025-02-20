package com.airport.controller;

import org.springframework.web.bind.annotation.RestController;

import com.airport.model.Family;

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

@RestController
@RequestMapping("/api/planes")
@CrossOrigin(origins = "http://localhost:3000")
public class PlaneController {

    @PostMapping("/autofill/{planeId}")
    public ResponseEntity<Map<String, List<Family>>> autoFillPlane(
            @PathVariable Long planeId,
            @RequestBody Map<String, Integer> request) {
            
        int currentPassengers = request.get("currentPassengers");
        List<Family> newFamilies = new ArrayList<>();
        String[] destinations = {"Kalush", "Kosiv", "Galych", "Kolomiya"};
        Random random = new Random();

        while (currentPassengers < 100) {
            int newCount = random.nextInt(4) + 1;
            if (currentPassengers + newCount > 100) {
                newCount = 100 - currentPassengers;
            }
            if (newCount == 0) break;

            String familyName = generateFamilyName();
            String randomDestination = destinations[random.nextInt(destinations.length)];
            
            Family family = new Family(familyName, randomDestination, newCount, planeId.intValue());
            
            newFamilies.add(family);
            currentPassengers += newCount;
        }

        Map<String, List<Family>> response = new HashMap<>();
        response.put("families", newFamilies);
        return ResponseEntity.ok(response);
    }

    private String generateFamilyName() {
        Random random = new Random();
        String letters = "abcdefghijklmnopqrstuvwxyz";
        return String.valueOf(letters.charAt(random.nextInt(26))) + 
               letters.charAt(random.nextInt(26));
    }
}
