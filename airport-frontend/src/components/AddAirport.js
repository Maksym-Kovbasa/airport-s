import React, { useState } from 'react';
import axios from 'axios';

const AddAirport = () => {
    const [airport, setAirport] = useState({
        name: '',
        city: '',
        country: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await axios.post('http://localhost:8080/api/airports', airport);
        console.log('Airport added:', response.data);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Airport Name"
                onChange={(e) => setAirport({...airport, name: e.target.value})}
            />
            <button type="submit">Add Airport</button>
        </form>
    );
};

export default AddAirport;
