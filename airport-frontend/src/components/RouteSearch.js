import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { config } from '../config/config';
import 'airport-frontend/src/components/style/RouteSearch.css';

const RouteSearch = () => {

    const [startPoint, setStartPoint] = useState('');
    const [endPoint, setEndPoint] = useState('');
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(false);
    const getCoordinates = async (city) => {
        try {
            const response = await fetch(
                `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(city)}&key=${config.GEOCODING_API_KEY}`
            );
            const data = await response.json();

            if (data.results && data.results[0]) {
                const { lat, lng } = data.results[0].geometry;
                console.log(`Coordinates for ${city}: Latitude: ${lat}, Longitude: ${lng}`);
                return {
                    latitude: Number(lat),
                    longitude: Number(lng)
                };
            }
        } catch (error) {
            console.log('Geocoding error:', error);
        }
        return null;
    };

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const toRad = (degree) => degree * Math.PI / 180;

        const R = 6371; // Earth's radius in kilometers
        const φ1 = toRad(lat1);
        const φ2 = toRad(lat2);
        const Δφ = toRad(lat2 - lat1);
        const Δλ = toRad(lon2 - lon1);

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c; // Returns distance in kilometers
    };

    const findNearestValidAirport = (coords, airports, targetCoords = null) => {
        // Define major hub regions
        const REGIONS = {
            OCEANIA: { minLat: -45, maxLat: -10, minLng: 110, maxLng: 155 },
            EUROPE: { minLat: 35, maxLat: 60, minLng: -10, maxLng: 30 }
        };

        // For Australia, prioritize major Australian airports
        if (coords.lat < 0 && coords.lng > 110) {
            const australianAirports = airports.filter(airport =>
                airport.latitude < 0 &&
                airport.longitude > 110 &&
                airport.longitude < 155
            );
            if (australianAirports.length > 0) {
                return findNearest(australianAirports);
            }
        }

        // For European destinations, prioritize major European airports
        if (targetCoords && targetCoords.lng < 20 && targetCoords.lng > -10) {
            const europeanAirports = airports.filter(airport =>
                airport.latitude > 35 &&
                airport.latitude < 60 &&
                airport.longitude > -10 &&
                airport.longitude < 30
            );
            if (europeanAirports.length > 0) {
                return findNearest(europeanAirports);
            }
        }

        function findNearest(airportList) {
            return airportList.reduce((nearest, airport) => {
                const distance = calculateDistance(
                    coords.lat,
                    coords.lng,
                    airport.latitude,
                    airport.longitude
                );
                if (!nearest || distance < nearest.distance) {
                    return { airport, distance };
                }
                return nearest;
            }, null);
        }

        return findNearest(airports);
    }; const [departureCoords, setDepartureCoords] = useState(null);
    const [destinationCoords, setDestinationCoords] = useState(null);
    const handleCitySelect = (suggestion, type) => {
        if (type === 'departure') {
            setStartPoint(`${suggestion.city}, ${suggestion.country}`);
            setDepartureSuggestions([]);
            // Store the coordinates
            setDepartureCoords(suggestion.coords);
        } else {
            setEndPoint(`${suggestion.city}, ${suggestion.country}`);
            setDestinationSuggestions([]);
            // Store the coordinates
            setDestinationCoords(suggestion.coords);
        }
        console.log(`Selected city: ${suggestion.city}, Coordinates: (${suggestion.coords.lat}, ${suggestion.coords.lng})`);

    };





    const MAX_BUS_DISTANCE = 300; // kilometers

    const findAlternativeRoute = async (coords, airports, excludedAirports = []) => {
        // Filter out already tried airports
        const availableAirports = airports.filter(airport => 
            !excludedAirports.find(excluded => excluded.city === airport.city)
        );

        // Find next nearest airport
        return findNearestValidAirport(coords, availableAirports);
    };

    const searchRoutes = async () => {
        setLoading(true);
        try {
            const airportsResponse = await axios.get(`http://localhost:8080/api/airports`);
            const allAirports = airportsResponse.data;
            const triedDepartureAirports = [];
            const triedDestinationAirports = [];

            let validRoute = false;
            let nearestDeparture, nearestDestination;
            const directDistance = calculateDistance(
                departureCoords.lat,
                departureCoords.lng,
                destinationCoords.lat,
                destinationCoords.lng
            );

            // If distance is less than 150km, create direct bus route
            if (directDistance <= 150) {
                setRoutes([{
                    startPoint,
                    endPoint,
                    segments: [{
                        type: 'Bus',
                        departure: startPoint,
                        arrival: endPoint,
                        distance: directDistance
                    }]
                }]);
                setLoading(false);
                return;
            }

            while (!validRoute) {
                // Get nearest airports excluding previously tried ones
                nearestDeparture = await findAlternativeRoute(departureCoords, allAirports, triedDepartureAirports);
                nearestDestination = await findAlternativeRoute(destinationCoords, allAirports, triedDestinationAirports);

                if (!nearestDeparture || !nearestDestination) {
                    console.log("No valid route found after trying all alternatives");
                    setRoutes([]);
                    break;
                }

                // Check for water crossings
                const hasWaterToDeparture = await checkWaterBodies(departureCoords, {
                    lat: nearestDeparture.airport.latitude,
                    lng: nearestDeparture.airport.longitude
                });

                const hasWaterToDestination = await checkWaterBodies({
                    lat: nearestDestination.airport.latitude,
                    lng: nearestDestination.airport.longitude
                }, destinationCoords);

                if (!hasWaterToDeparture && !hasWaterToDestination) {
                    validRoute = true;
                } else {
                    // Add current airports to tried list and continue searching
                    if (hasWaterToDeparture) {
                        triedDepartureAirports.push(nearestDeparture.airport);
                    }
                    if (hasWaterToDestination) {
                        triedDestinationAirports.push(nearestDestination.airport);
                    }
                }
            }

            if (validRoute) {
                // Create route segments with valid airports
                const routeSegments = [];
        
                routeSegments.push({
                    type: 'Bus',
                    departure: startPoint,
                    arrival: nearestDeparture.airport.city
                });

                routeSegments.push({
                    type: 'Flight',
                    departure: nearestDeparture.airport.city,
                    arrival: nearestDestination.airport.city
                });

                routeSegments.push({
                    type: 'Bus',
                    departure: nearestDestination.airport.city,
                    arrival: endPoint
                });

                setRoutes([{
                    startPoint,
                    endPoint,
                    segments: routeSegments
                }]);
            }

        } catch (error) {
            console.error('Route search error:', error);
        } finally {
            setLoading(false);
        }
    };    const [departureSuggestions, setDepartureSuggestions] = useState([]);
    const [destinationSuggestions, setDestinationSuggestions] = useState([]);

    const getCitySuggestions = async (city, isSuggestionType) => {
        try {
            const response = await fetch(
                `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(city)}&key=${config.GEOCODING_API_KEY}&limit=5&language=en&pretty=1`
            );
            const data = await response.json();

            const suggestions = data.results.map(result => ({
                city: result.components.city || result.components.town || result.components.village,
                country: result.components.country,
                coords: result.geometry
            })).filter(item => item.city);

            if (isSuggestionType === 'departure') {
                setDepartureSuggestions(suggestions);
            } else {
                setDestinationSuggestions(suggestions);
            }
        } catch (error) {
            console.log('Suggestion fetch error:', error);
        }
    };

    const checkWaterBodies = async (startCoords, endCoords) => {
        // Check several points along the path
        const steps = 5;
        const latStep = (endCoords.lat - startCoords.lat) / steps;
        const lngStep = (endCoords.lng - startCoords.lng) / steps;

        for (let i = 0; i <= steps; i++) {
            const checkPoint = {
                lat: startCoords.lat + (latStep * i),
                lng: startCoords.lng + (lngStep * i)
            };

            const response = await fetch(
                `https://api.opencagedata.com/geocode/v1/json?q=${checkPoint.lat}+${checkPoint.lng}&key=${config.GEOCODING_API_KEY}`
            );
            const data = await response.json();

            if (data.results && data.results[0]) {
                const components = data.results[0].components;
                // Check if point is in ocean or sea
                if (components.body_of_water || components.ocean || components.sea) {
                    return true; // Water body detected
                }
            }
        }
        return false; // No water bodies detected
    };

    return (
        <div className="route-search-container">
            <div className="search-panel">
                <div className="input-container">
                    <input
                        type="text"
                        placeholder="Enter departure city"
                        value={startPoint}
                        onChange={(e) => {
                            setStartPoint(e.target.value);
                            getCitySuggestions(e.target.value, 'departure');
                        }}
                    />
                    {departureSuggestions.length > 0 && (
                        <div className="suggestions-list">
                            {departureSuggestions.map((suggestion, index) => (
                                <div
                                    key={index}
                                    className="suggestion-item"
                                    onClick={() => handleCitySelect(suggestion, 'departure')}
                                >
                                    {suggestion.city}, {suggestion.country}
                                    <span className="coordinates">
                                        ({suggestion.coords.lat.toFixed(2)}, {suggestion.coords.lng.toFixed(2)})
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

                </div>

                <div className="input-container">
                    <input
                        type="text"
                        placeholder="Enter arrival city"
                        value={endPoint}
                        onChange={(e) => {
                            setEndPoint(e.target.value);
                            getCitySuggestions(e.target.value, 'destination');
                        }}
                    />
                    {destinationSuggestions.length > 0 && (
                        <div className="suggestions-list">
                            {destinationSuggestions.map((suggestion, index) => (
                                <div
                                    key={index}
                                    className="suggestion-item"
                                    onClick={() => handleCitySelect(suggestion, 'destination')}
                                >
                                    {suggestion.city}, {suggestion.country}
                                    <span className="coordinates">
                                        ({suggestion.coords.lat.toFixed(2)}, {suggestion.coords.lng.toFixed(2)})
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

                </div>

                <button
                    onClick={searchRoutes}
                    disabled={loading || !startPoint || !endPoint}
                >
                    {loading ? 'Searching...' : 'Find Routes'}
                </button>
            </div>

            <div className="results-container">
                {routes.map((route, index) => (
                    <div key={index} className="route-card">
                        <h3>Recommended Route</h3>
                        <p>From: {route.startPoint}</p>
                        <p>To: {route.endPoint}</p>
                        <div className="segments">
                            {route.segments.map((segment, segIndex) => (
                                <div key={segIndex} className="segment">
                                    <p>Step {segIndex + 1}: {segment.type}</p>
                                    <p>From: {segment.departure}</p>
                                    <p>To: {segment.arrival}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                {routes.length === 0 && !loading && (
                    <div className="no-routes">
                        <p>No routes found. Try different cities.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RouteSearch;