import React from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';

const RouteMap = ({ routes }) => {
    return (
        <MapContainer center={[48.9226, 24.7111]} zoom={7}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {routes.map((route, index) => (
                <Polyline 
                    key={index}
                    positions={route.segments.map(segment => [
                        segment.fromLat,
                        segment.fromLng
                    ])}
                    color={route.transportType === 'FLIGHT' ? 'blue' : 'green'}
                />
            ))}
        </MapContainer>
    );
};

export default RouteMap;
