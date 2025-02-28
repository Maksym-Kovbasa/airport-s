# Airport Management System

## Description of the project

Airport Simulation is a simulation system for simulating airport operations, including flight, passenger, aircraft and route management. The project allows simulation of boarding, departure, transfer and ground transportation of passengers.

## Functional

- Passenger management: distribution of passengers between buses and planes.

- Flight Handling: Simulation of takeoffs, landings, and flight delays.

- Airport Simulation: Using Multithreading to Manage Runways.

- Geographical integration: working with cartographic data through Leaflet.js.

- Advanced Route Search: Streamline passenger movement between cities where there are no airports through buses and nearby airports.

## Technologies used

Backend:

- Java

- Spring Boot

- SQLite (to save information about airports, flights, and passengers)

- Maven (for dependency management)

Frontend:

- React

- Leaflet.js (display maps and routes)


## Project structure
```
airport-s/
│-- src/                         # Backend on Spring Boot
│   │-- /main/java/com/airport/  # Main server code
│   │-- /main/resources/         # Configuration files
│   └-- pom.xml                  # Maven dependency file
│-- frontend/                    # Client-side in React
│   │-- src/                     # Main frontend code
│   └-- package.json             # Node.js dependency file
│-- database                     # SQLite database
└-- README.md                    # Project description
```

## Main classes and modules

Backend (Spring Boot):

- AirportService is the logic of airport management.

- FlightService – processing flight information.

- PassengerService – passenger management.

- RouteOptimization is an algorithm for finding the best routes.

Frontend (React):

- RouteSearch.js - path search algorithm

- AirportList.js – display available airports and flights.

## Getting Started

### Backend Setup
To start the Spring Boot server:
```bash
mvn spring-boot:run
```

## Frontend
- Navigate to the frontend directory
```bash
cd airport-frontend
``` 

- Promise based HTTP client for the browser
```bash
npm install axios
```
```bash
npm install react-router-dom
```
```bash
npm install leaflet react-leaflet
```
- React-scripts start is the proper command to run the React app in dev mode
```bash
npm start
```
