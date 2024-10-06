// src/components/GameGuessingModal.js
import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';

const GameGuessingModal = ({ open, handleClose, handleGuess }) => {
    const [nameGuess, setNameGuess] = useState('');
    const [capitalGuess, setCapitalGuess] = useState('');

    const handleSubmit = () => {
        handleGuess({ nameGuess, capitalGuess });
        handleClose();
    };

    return (
        <Modal open={open} onClose={handleClose} aria-labelledby="guessing-modal">
            <Box sx={{ 
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', 
                width: 400, bgcolor: 'background.paper', p: 4 
            }}>
                <Typography variant="h6" component="h2">
                    Guess the Country Info
                </Typography>
                <TextField
                    label="Country Name"
                    fullWidth
                    value={nameGuess}
                    onChange={(e) => setNameGuess(e.target.value)}
                    sx={{ mt: 2 }}
                />
                <TextField
                    label="Capital"
                    fullWidth
                    value={capitalGuess}
                    onChange={(e) => setCapitalGuess(e.target.value)}
                    sx={{ mt: 2 }}
                />
                <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ mt: 2 }}>
                    Submit Guess
                </Button>
            </Box>
        </Modal>
    );
};

export default GameGuessingModal;
