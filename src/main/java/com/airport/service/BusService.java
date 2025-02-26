package com.airport.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.airport.model.Bus;
import com.airport.repository.BusRepository;

@Service
public class BusService {
    
    @Autowired
    private BusRepository busRepository;
    
    public Bus save(Bus bus) {
        return busRepository.save(bus);
    }
    
    public List<Bus> findAll() {
        return busRepository.findAll();
    }
}
