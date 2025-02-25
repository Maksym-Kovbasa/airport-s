import React, { useState, useEffect } from 'react';
import { airportApi } from '../services/api';
import 'airport-frontend/src/components/style/AirportForm.css';



const AirportForm = ({ onAirportAdded, editingAirport, onUpdate }) => {
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        city: '',
        country: ''
    });

    useEffect(() => {
        if (editingAirport) {
            setFormData(editingAirport);
        }
    }, [editingAirport]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingAirport) {
            await onUpdate(formData);
        } else {
            const response = await airportApi.createAirport(formData);
            onAirportAdded(response.data);
        }
        setFormData({ name: '', code: '', city: '', country: '' });
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
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
                <button className ="submit" type="submit">
                    {editingAirport ? 'Update Airport' : 'Add Airport'}
                </button>
            </form>
        </div>
    );
};

export default AirportForm;