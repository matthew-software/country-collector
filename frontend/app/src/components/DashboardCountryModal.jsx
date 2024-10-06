// src/components/DashboardCountryModal.js
import React from 'react';
import { Modal, Box, Typography } from '@mui/material';

const DashboardCountryModal = ({ open, handleClose, country }) => {
    return (
        <Modal open={open} onClose={handleClose} aria-labelledby="country-info-modal">
            <Box sx={{ 
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', 
                width: 400, bgcolor: 'background.paper', p: 4 
            }}>
                <Typography variant="h6" component="h2">
                    {country.name}
                </Typography>
                <Typography sx={{ mt: 2 }}>
                    Capital: {country.capital}
                </Typography>
                <Typography sx={{ mt: 2 }}>
                    Flag: <img src={country.flag} alt={`${country.name} flag`} width="100%" />
                </Typography>
            </Box>
        </Modal>
    );
};

export default DashboardCountryModal;
