import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

const MovingPlane = ({ from, to, name }) => {
    const map = useMap();
    const markerRef = useRef(null);

    useEffect(() => {
        const calculateBearing = (startLat, startLng, destLat, destLng) => {
            const toRad = n => n * Math.PI / 180;
            const toDeg = n => n * 180 / Math.PI;
            let dLong = destLng - startLng;
            if (dLong > 180) {
                dLong -= 360;
            } else if (dLong < -180) {
                dLong += 360;
            }
            dLong = toRad(dLong);

            const startLat_rad = toRad(startLat);
            const destLat_rad = toRad(destLat);


            const y = Math.sin(dLong) * Math.cos(destLat_rad);
            const x = Math.cos(startLat_rad) * Math.sin(destLat_rad) -
                Math.sin(startLat_rad) * Math.cos(destLat_rad) * Math.cos(dLong);


            return ((toDeg(Math.atan2(y, x)) + 360) % 360) - 45; // Adjust for initial orientation
        };

        const initialBearing = calculateBearing(from[0], from[1], to[0], to[1]);

        const updatePlaneIcon = (lat, lng, bearing) => {
            return L.divIcon({
                html: `<div style="transform: rotate(${bearing}deg); font-size: 30px;">✈️</div>`,
                className: 'plane-icon',
                iconSize: [40, 40]
            });
        };

        let marker = L.marker(from, { icon: updatePlaneIcon(from[0], from[1], initialBearing) });
        markerRef.current = marker;
        marker.addTo(map);

        let animationInterval;

        function animatePlane() {
            const duration = 5000;
            let startTime = null;

            let previousPosition = from;

            function move(timestamp) {
                if (!startTime) startTime = timestamp;
                const progress = (timestamp - startTime) / duration;

                if (progress < 1) {
                    const lat = from[0] + (to[0] - from[0]) * progress;
                    const lng = from[1] + (to[1] - from[1]) * progress;

                    // Обчислюємо кут між попередньою та поточною позиціями
                    const currentBearing = calculateBearing(previousPosition[0], previousPosition[1], lat, lng);
                    previousPosition = [lat, lng];

                    marker.setLatLng([lat, lng]);
                    marker.setIcon(updatePlaneIcon(lat, lng, currentBearing));
                    requestAnimationFrame(move);
                } else {
                    marker.setLatLng(to);
                    marker.setIcon(updatePlaneIcon(to[0], to[1], initialBearing));
                }
            }

            requestAnimationFrame(move);
        }

        animationInterval = setInterval(animatePlane, 5100);
        animatePlane();

        return () => {
            clearInterval(animationInterval);
            if (marker) {
                map.removeLayer(marker);
            }
        };
    }, [map, from, to]);

    return null;
};

const AirportMap = ({ airports }) => {
    const LVIV = [49.8397, 24.0297];
    const redIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
    const validAirports = airports.filter(airport =>
        airport?.latitude &&
        airport?.longitude &&
        !isNaN(Number(airport.latitude)) &&
        !isNaN(Number(airport.longitude))
    );

    return (
        <MapContainer
            center={[50.4501, 30.5234]}
            zoom={3}
            style={{ height: '500px', width: '100%', borderRadius: '10px' }}
        >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {validAirports.map(airport => (
                <React.Fragment key={airport.id}>
                    <MovingPlane
                        from={[Number(airport.latitude), Number(airport.longitude)]}
                        to={LVIV}
                        name={airport.name}
                    />
                </React.Fragment>
            ))}
            {validAirports.map(airport => (
                <Marker
                    key={airport.id}
                    position={[Number(airport.latitude), Number(airport.longitude)]}
                >
                    <Popup>
                        <div className="airport-popup">
                            <h3>{airport.name}</h3>
                            <p><strong>Code:</strong> {airport.code}</p>
                            <p><strong>Location:</strong> {airport.city}, {airport.country}</p>
                            <p><strong>Position:</strong> {Number(airport.latitude).toFixed(4)}°N, {Number(airport.longitude).toFixed(4)}°E</p>
                        </div>
                    </Popup>
                </Marker>
            ))}
            <Marker position={LVIV} icon={redIcon}>
                <Popup>
                    <div className="airport-popup">
                        <h3>Lviv International Airport</h3>
                        <p><strong>Position:</strong> {LVIV[0].toFixed(4)}°N, {LVIV[1].toFixed(4)}°E</p>
                    </div>
                </Popup>
            </Marker>
        </MapContainer>
    );
};

export default AirportMap;
