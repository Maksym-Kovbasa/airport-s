package com.airport.repository;

import com.airport.model.FlightHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FlightHistoryRepository extends JpaRepository<FlightHistory, Long> {
    List<FlightHistory> findAllByOrderByRecordedAtDesc();
}
