const [destination, setDestination] = useState('');
const [airports, setAirports] = useState([]);

useEffect(() => {
    // Fetch airports from backend
    fetch('/api/airports')
        .then(res => res.json())
        .then(data => setAirports(data));
}, []);

// Add destination dropdown
<select 
    value={destination}
    onChange={(e) => setDestination(e.target.value)}
    required
>
    <option value="">Select Destination</option>
    {airports
        .filter(airport => airport.code !== departure)
        .map(airport => (
            <option key={airport.code} value={airport.code}>
                {airport.name}
            </option>
        ))}
</select>
