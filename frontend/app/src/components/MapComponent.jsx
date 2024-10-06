import React, { useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, TextField } from '@mui/material';
import api from '../api';

const MapComponent = ({ geoData, countriesInfo = [], collectedInfo = [], setCollectedInfo, appType }) => {
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [countryInfo, setCountryInfo] = useState(null);
    const [uncollectedCountries, setUncollectedCountries] = useState([]);
    const [formInput, setFormInput] = useState({ countryName: '', capitalName: '', selectedFlag: null });

    const handleCountryMouseover = (layer) => {
        layer.setStyle({
            // weight: 3,
            color: 'white',
            // fillOpacity: 0.7,
        });
    };
    
    const handleCountryMouseout = (layer) => {
        layer.setStyle({
            // weight: 1,
            // color: 'black',
            // fillOpacity: 0.2,
            
            // fillColor: isCollected ? 'aqua' : 'darkslategray',
            // weight: 1,
            color: 'black',
            // fillOpacity: 0.3,
        });
    };

    const handleCountryClick = (feature) => {
        const iso_a2 = feature.properties.ISO_A2;

        // Update selected country
        setSelectedCountry(feature);
        
        // Find country information
        const foundCountryInfo = countriesInfo.find(
            country => country.country_code === iso_a2
        );
        
        setCountryInfo(foundCountryInfo);

        // If in game mode, filter out uncollected countries
        if (appType === 'game') {
            const allUncollectedCountries = countriesInfo.filter(
                country => !collectedInfo.includes(country.country_code)
            );
            setUncollectedCountries(allUncollectedCountries);
        }

        handleModalOpen();
    };

    const handleModalOpen = () => {
        setOpenModal(true);
        document.querySelector('.map-container').setAttribute('inert', 'true');
    };

    const handleModalClose = () => {
        setOpenModal(false);
        document.querySelector('.map-container').removeAttribute('inert');
        // Optionally add a timeout to prevent flickering
        setTimeout(() => {
            setSelectedCountry(null);
            setCountryInfo(null); // Clear the country info
            setUncollectedCountries([]); // Clear uncollected countries when closing
            setFormInput({ countryName: '', capitalName: '', selectedFlag: null });
        }, 300); // 300 ms delay
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormInput({ ...formInput, [name]: value });
    };

    const handleFlagClick = (countryCode) => {
        setFormInput({ ...formInput, selectedFlag: countryCode });
    };

    const handleSubmit = async () => {
        try {
            const response = await api.post('/api/check-country-guess/', {
                clickedCountry: countryInfo.country_name,
                countryName: formInput.countryName,
                capitalName: formInput.capitalName,
                selectedFlag: formInput.selectedFlag,
            });

            if (response.data.message === 'Country collected successfully') {
                alert('You collected a new country!');

                // Update the map to reflect the newly collected country
                setCollectedInfo((prevCollectedInfo) => [...prevCollectedInfo, response.data.country_code]);

                handleModalClose();
            } else {
                alert(response.data.message); // Either "Country already collected" or "Incorrect country information"
            }
        } catch (error) {
            console.error('Error submitting guess:', error);
            alert('Error checking the country guess. Please try again.');
        }
    };


    const formatCountryName = (countryName) => {
        return countryName.toLowerCase().replace(/ /g, '_');
    };

    // Style function for countries in the map
    const countryStyle = (feature) => {
        const iso_a2 = feature.properties.ISO_A2;
        const isCollected = collectedInfo.includes(iso_a2);

        return {
            fillColor: isCollected ? 'aqua' : 'darkslategray',
            weight: 1,
            color: 'black',
            fillOpacity: isCollected ? 0.8 : 0.3,
        };
    };

    const onEachFeature = (feature, layer) => {
        const iso_a2 = feature.properties.ISO_A2;
        const isCollected = collectedInfo.includes(iso_a2);

        // Country borders glow white and are clickable in the dashboard (but only if uncollected in the game)
        if (
            (appType === 'dash') ||
            (appType === 'game' && !isCollected)
        ) {
            layer.on({
                mouseover: () => handleCountryMouseover(layer),
                mouseout: () => handleCountryMouseout(layer),
                click: () => handleCountryClick(feature),
            });
        }
    };

    return (
        <>
            <MapContainer className="map-container" center={[0, 0]} zoom={2} minZoom={2} zoomControl={false}
                maxBounds={[
                    [-90, -180], // Southwest coordinates
                    [90, 180] // Northeast coordinates
                ]}
                maxBoundsViscosity={1.0}
                style={{ height: '100vh', width: '100%' }}
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />
                {geoData && (
                    <GeoJSON
                        key={collectedInfo.join(',')}
                        data={geoData}
                        style={countryStyle}
                        onEachFeature={onEachFeature}
                    />
                )}
            </MapContainer>

            {/* Modal/ Dialog for Dashboard or Game */}
            <Dialog open={openModal} onClose={handleModalClose}>
                <DialogTitle style={{ background: 'darkslategray', color: 'white' }}>
                    {appType === 'dash' ? (
                        selectedCountry && countryInfo ? (
                            <div fontSize="h4" text-align="center">
                                {countryInfo.country_name}
                            </div>
                        ) : ('Loading country name...')
                        ) : ('Guess the Country')}
                </DialogTitle>
                <DialogContent style={{ color: 'darkslategray', background: 'lightgray' }}>
                    {appType === 'dash' ? (
                        // Existing Dashboard Modal rendering...
                        selectedCountry && countryInfo ? (
                            <div>
                                <Typography variant="h6" textAlign="center">
                                    ___{/* countryInfo.country_name */}
                                </Typography>
                                <Typography>
                                    <img
                                        src={`${import.meta.env.VITE_API_URL}/static/${formatCountryName(countryInfo.country_name)}_flag.png`}
                                        alt={`${countryInfo.country_name} flag`}
                                        style={{ width: '100px', height: 'auto' }}
                                    />
                                </Typography>
                                <Typography>
                                    Capital: {countryInfo.capital || 'Unknown'}
                                </Typography>
                                <Typography>
                                    ISO Code: {selectedCountry.properties.ISO_A2}
                                </Typography>
                            </div>
                        ) : (
                            <Typography>Loading country data...</Typography>
                        )
                    ) : (
                        // Game Modal: Form and scrollable list of flags for uncollected countries
                        <div>
                            <TextField
                                label="Country Name"
                                name="countryName"
                                value={formInput.countryName}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Capital Name"
                                name="capitalName"
                                value={formInput.capitalName}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                            <Typography variant="h6">Select a Flag</Typography>
                            <div style={{ maxHeight: '300px', overflowY: 'auto', display: 'flex', flexWrap: 'wrap' }}>
                                {uncollectedCountries.length > 0 && uncollectedCountries.map((country) => (
                                    <div
                                        key={country.country_code}
                                        onClick={() => handleFlagClick(country.country_code)}
                                        style={{
                                            margin: '5px',
                                            textAlign: 'center',
                                            cursor: 'pointer',
                                            padding: '3px'
                                        }}
                                    >
                                        <img
                                            src={`${import.meta.env.VITE_API_URL}/static/${formatCountryName(country.country_name)}_flag.png`}
                                            alt = {`???`}
                                            style={{
                                                width: '50px',
                                                height: 'auto',
                                                border: formInput.selectedFlag === country.country_code ? '3px solid blue' : 'none',
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </DialogContent>
                <DialogActions style={{ color: 'white', background: 'lightgray' }}>
                    <Button onClick={handleModalClose}>Close</Button>
                    {appType === 'game' && (
                        <Button
                            onClick={handleSubmit}
                            disabled={!formInput.countryName || !formInput.capitalName || !formInput.selectedFlag}
                        >
                            Submit
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </>
    );
};

export default MapComponent;
