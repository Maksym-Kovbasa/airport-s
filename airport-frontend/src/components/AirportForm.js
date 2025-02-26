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
    const [citySuggestions, setCitySuggestions] = useState([]);

    const getCitySuggestions = async (cityQuery) => {
        try {
            const response = await fetch(
                `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(cityQuery)}&key=${config.GEOCODING_API_KEY}&limit=5&language=en`
            );
            const data = await response.json();
            
            const suggestions = data.results.map(result => ({
                city: result.components.city || result.components.town || result.components.village,
                country: result.components.country,
                coords: result.geometry
            })).filter(item => item.city);

            setCitySuggestions(suggestions);
        } catch (error) {
            console.log('Suggestion fetch error:', error);
        }
    };

    const handleCitySelect = (suggestion) => {
        setFormData(prev => ({
            ...prev,
            city: suggestion.city,
            country: suggestion.country,
            latitude: suggestion.coords.lat,
            longitude: suggestion.coords.lng
        }));
        setCitySuggestions([]);
    };

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
                    placeholder="Airport Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="code"
                    placeholder="Airport Code"
                    value={formData.code}
                    onChange={handleChange}
                    required
                />
                <div className="input-container">
                    <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={formData.city}
                        onChange={(e) => {
                            handleChange(e);
                            getCitySuggestions(e.target.value);
                        }}
                        required
                    />
                    {citySuggestions.length > 0 && (
                        <div className="suggestions-list">
                            {citySuggestions.map((suggestion, index) => (
                                <div 
                                    key={index} 
                                    className="suggestion-item"
                                    onClick={() => handleCitySelect(suggestion)}
                                >
                                    {suggestion.city}, {suggestion.country}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
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