package com.airport.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.airport.model.Route;

@Repository
public interface RouteRepository extends JpaRepository<Route, Long> {
    List<Route> findByStartPointAndEndPoint(String startPoint, String endPoint);
}
