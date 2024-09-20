import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../api';  // Import your axios instance

const MapComponent = () => {
    const [geoData, setGeoData] = useState(null);  // GeoJSON data for all countries
    const [collectedCountries, setCollectedCountries] = useState([]);  // Collected countries data

    // Fetch GeoJSON data (example: from a file or an API endpoint)
    useEffect(() => {
        fetch('/geojson/countries.geojson')
            .then(response => response.json())
            .then(data => {
                console.log("Fetched GeoJSON Data: ", data);

                // Check if it's a GeometryCollection and convert it to a FeatureCollection
                if (data.type === 'GeometryCollection') {
                    const featureCollection = {
                        type: 'FeatureCollection',
                        features: data.geometries.map(geometry => ({
                            type: 'Feature',
                            geometry: geometry,
                            properties: {}  // Add any properties if needed, such as country codes
                        }))
                    };
                    setGeoData(featureCollection);
                    console.log("Converted GeoJSON to FeatureCollection:", featureCollection);
                } else {
                    setGeoData(data);  // If it's already a FeatureCollection, just set it
                    console.log("GeoJSON Data is already a FeatureCollection:", data);
                }
            })
            .catch(error => console.error('Error fetching GeoJSON:', error));
    }, []);

    // Fetch collected countries for the user from the backend API
    useEffect(() => {
        api.get('/api/collected-countries/')
            .then(response => {
                console.log('Fetched Collected Countries:', response.data);
                // Ensure we are extracting the array from the response
                if (response.data && Array.isArray(response.data.collected_countries)) {
                    setCollectedCountries(response.data.collected_countries);
                } else {
                    console.error('Expected an array of collected countries');
                }
            })
            .catch(error => console.error('Error fetching collected countries:', error));
    }, []);

    // Function to style the country polygons
    const countryStyle = (feature) => {
        const iso_a2 = feature.properties.ISO_A2;  // Use ISO_A2 code

        if (!iso_a2) {
            console.warn('Feature does not have ISO_A2 property:', feature.properties);
            return {
                fillColor: '#555555',  // Default color for features without ISO_A2
                weight: 1,
                color: '#000',
                fillOpacity: 0.3
            };
        }

        if (!Array.isArray(collectedCountries)) {
            console.error('collectedCountries is not an array');
            return {
                fillColor: '#555555',  // Default color
                weight: 1,
                color: '#000',
                fillOpacity: 0.3
            };
        }

        const isCollected = collectedCountries.includes(iso_a2);
        console.log('Feature Properties:', feature.properties); // Log feature properties for debugging

        return {
            fillColor: isCollected ? '#FFD700' : '#555555',  // Highlight collected countries in gold, others in dark gray
            weight: 1,
            color: '#000',
            fillOpacity: isCollected ? 0.8 : 0.3
        };
    };

    return (
        <MapContainer center={[0, 0]} zoom={2} style={{ height: '100vh', width: '100%' }}>
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            {geoData && (
                <GeoJSON
                    data={geoData}
                    style={countryStyle}
                    onEachFeature={(feature, layer) => {
                        // Optional: Add additional interactions or debugging here
                    }}
                />
            )}
        </MapContainer>
    );
};

export default MapComponent;
