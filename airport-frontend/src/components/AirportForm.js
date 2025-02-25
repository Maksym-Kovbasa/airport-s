import React, { useState, useEffect } from 'react';
import { airportApi } from '../services/api';
import 'airport-frontend/src/components/style/AirportForm.css';
import { config } from '../config/config';

const AirportForm = ({ onAirportAdded, editingAirport, onUpdate }) => {
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        city: '',
        country: '',
        latitude: null,
        longitude: null
    });

    const getCoordinates = async (city, country) => {
        try {
            const response = await fetch(
                `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(city)},${encodeURIComponent(country)}&key=${config.GEOCODING_API_KEY}`
            );
            const data = await response.json();

            if (data.results && data.results[0]) {
                const { lat, lng } = data.results[0].geometry;
                setFormData(prev => ({
                    ...prev,
                    latitude: Number(lat),
                    longitude: Number(lng)
                }));
                console.log('Coordinates updated:', lat, lng);
            }
        } catch (error) {
            console.log('Geocoding error:', error);
        }
    };

    useEffect(() => {
        if (formData.city && formData.country) {
            getCoordinates(formData.city, formData.country);
        }
    }, [formData.city, formData.country]);

    useEffect(() => {
        if (editingAirport) {
            setFormData(editingAirport);
        }
    }, [editingAirport]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const airportData = {
            ...formData,
            latitude: Number(formData.latitude),
            longitude: Number(formData.longitude)
        };

        if (editingAirport) {
            await onUpdate(airportData);
        } else {
            const response = await airportApi.createAirport(airportData);
            onAirportAdded(response.data);
        }
        setFormData({ name: '', code: '', city: '', country: '', latitude: null, longitude: null });
    };

    return (
        <div className="form-container">
            <h3>{editingAirport ? 'Edit Airport' : 'Add New Airport'}</h3>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Airplane Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="code"
                    placeholder="Airport Code(name)"
                    value={formData.code}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="country"
                    placeholder="Country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                />
                <div className="coordinates-display">
                    <p>Latitude: {formData.latitude} Longitude: {formData.longitude}</p>
                </div>
                <button className="submit" type="submit">
                    {editingAirport ? 'Update Airport' : 'Add Airport'}
                </button>
            </form>
        </div>
    );
};

export default AirportForm;