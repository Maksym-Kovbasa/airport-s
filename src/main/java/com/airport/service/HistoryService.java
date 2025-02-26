package com.airport.service;

import com.airport.model.BusHistory;
import com.airport.model.FlightHistory;
import com.airport.repository.BusHistoryRepository;
import com.airport.repository.FlightHistoryRepository;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class HistoryService {
    @Autowired
    private FlightHistoryRepository flightHistoryRepository;

    @Autowired
    private BusHistoryRepository busHistoryRepository;

    public FlightHistory saveFlightHistory(FlightHistory history) {
        history.setRecordedAt(LocalDateTime.now());
        return flightHistoryRepository.save(history);
    }

    public BusHistory saveBusHistory(BusHistory history) {
        history.setRecordedAt(LocalDateTime.now());
        return busHistoryRepository.save(history);
    }

    public List<FlightHistory> getAllFlightHistory() {
        return flightHistoryRepository.findAllByOrderByRecordedAtDesc();
    }

    public List<BusHistory> getAllBusHistory() {
        return busHistoryRepository.findAllByOrderByRecordedAtDesc();
    }

    @Transactional
    public void clearBusHistory() {
        List<BusHistory> busHistories = busHistoryRepository.findAll();
        for (BusHistory bus : busHistories) {
            bus.getPassengers().clear();
        }
        busHistoryRepository.deleteAll();
    }

    @Transactional
    public void clearFlightHistory() {
        List<FlightHistory> flightHistories = flightHistoryRepository.findAll();
        for (FlightHistory flight : flightHistories) {
            flight.getPassengers().clear();
        }
        flightHistoryRepository.deleteAll();
    }

}
