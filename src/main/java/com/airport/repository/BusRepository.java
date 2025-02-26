package com.airport.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.airport.model.Bus;

@Repository
public interface BusRepository extends JpaRepository<Bus, Long> {
    // Custom query methods can be added here if needed
}
