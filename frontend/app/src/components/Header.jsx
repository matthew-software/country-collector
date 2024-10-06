import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import '../styles/Header.css';

const Header = ({ username }) => {
  const navigate = useNavigate();
  
  // Default menu state
  const defaultMenuItems = [
    { label: 'PLAY', submenu: true },
    { label: 'Info', path: '/info' },
    { label: 'Account', path: '/account' },
    { label: 'Help', path: '/help' },
    { label: 'Logout', path: '/logout' },
  ];

  // PLAY submenu
  const playSubmenuItems = [
    { label: 'Collector', path: '/game/collector' },
    { label: 'Random', path: '/game/random' },
    { label: 'Free Play', path: '/game/freeplay' },
  ];

  const [anchorEl, setAnchorEl] = useState(null);
  const [menuItems, setMenuItems] = useState(defaultMenuItems); // Start with the default menu

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Handle navigation and reset the menu to default after a route is chosen
  const handleNavigate = (path) => {
    navigate(path);
    setMenuItems(defaultMenuItems); // Reset menu to default
    handleMenuClose(); // Close the menu after clicking
  };

  // Switch to PLAY submenu
  const handlePlayClick = () => {
    setMenuItems(playSubmenuItems); // Switch to PLAY submenu
  };

  return (
    <AppBar position="static" sx={{ bgcolor: "black" }}>
      <Toolbar>
        {/* "COUNTRY COLLECTOR" clickable, navigates to home */}
        <Typography 
          variant="h4" 
          component="div" 
          sx={{ flexGrow: 1, cursor: 'pointer' }} 
          onClick={() => navigate('/')}
          color="white"
        >
          Country Collector
        </Typography>

        

        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={handleMenuOpen}
        >
          <Typography variant="h6" sx={{ mr: 1 }}>
            {username}
          </Typography>
          <MenuIcon />
        </IconButton>

        {/* Main Dropdown */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          {menuItems.map((item, index) => (
            item.submenu ? (
              <MenuItem key={index} onClick={handlePlayClick}>
                {item.label}
              </MenuItem>
            ) : (
              <MenuItem key={index} onClick={() => handleNavigate(item.path)}>
                {item.label}
              </MenuItem>
            )
          ))}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
