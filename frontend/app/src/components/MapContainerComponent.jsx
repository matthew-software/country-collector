import React, { useState, useEffect } from 'react';
import api from '../api';
import MapComponent from './MapComponent';

const MapContainerComponent = ({ appType }) => {
    const [geoData, setGeoData] = useState(null);  // GeoJSON data for all countries
    const [countries, setCountries] = useState([]);  // All countries info
    const [collectedCountryCodes, setCollectedCountryCodes] = useState([]);  // Collected country codes

    // Fetch GeoJSON data
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
                            properties: {}  // Add any properties if needed
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

    // Fetch collected countries and collected country codes
    useEffect(() => {
        // const apiUrl = '/api/collected-countries/';
        const apiUrlCountries = '/api/all-countries/';
        const apiUrlCollected = '/api/collected-country-codes/';
        
        api.get(apiUrlCountries)
            .then(response => {
                console.log('Fetched Countries:', response.data);
                // Ensure we are extracting the array from the response
                if (response.data.countries) {
                    setCountries(response.data.countries);
                    console.log('COUNTRIES HEREEEEEE:', countries)
                } else {
                    console.error('Expected an array of collected countries');
                }
            })
            .catch(error => console.error('Error fetching countries:', error));
        api.get(apiUrlCollected)
            .then(response => {
                console.log('Fetched Codes:', response.data);
                // Ensure we are extracting the array from the response
                if (response.data.collected_country_codes) {
                    setCollectedCountryCodes(response.data.collected_country_codes);
                } else {
                    console.error('Expected an array of collected country codes');
                }

            })
            .catch(error => console.error('Error fetching codes', error));
    }, [appType]);

    if (!geoData) {
        return <div>Loading...</div>;
    }

    return (
        <MapComponent
            geoData={geoData}
            countriesInfo={countries}
            collectedInfo={collectedCountryCodes}
            setCollectedInfo={setCollectedCountryCodes}
            appType={appType}  // "dash" or "game" to differentiate
        />
    );
};

export default MapContainerComponent;
