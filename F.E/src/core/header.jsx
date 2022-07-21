import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';

import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

const Header = ({
  handleWallet,
  wallet,
  solana,
  handleSolana,
  getCampaigns,
  handleClickOpen,
}) => {
  const checkWalletConnection = async () => {
    try {
      const { solana } = window;
      if (solana.isPhantom) {
        handleSolana(solana);
        console.log('Phantom wallet found');
        const result = await solana.connect({ onlyIfTrusted: true });
        const key = result.publicKey.toString();
        console.log(key);
        handleWallet(key);
      } else {
        alert('No phantom wallet found');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const connectWallet = async () => {
    const result = await solana.connect();
    const key = await result.publicKey.toString();
    handleWallet(key);
    console.log(key);
  };

  useEffect(() => {
    const onLoad = async () => {
      await checkWalletConnection();
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  return (
    <AppBar position='static'>
      <Container maxWidth='xl'>
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant='h6'
            noWrap
            component='a'
            href='/'
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            LOGO
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size='large'
              aria-label='account of current user'
              aria-controls='menu-appbar'
              aria-haspopup='true'
              color='inherit'
            >
              <MenuIcon />
            </IconButton>
          </Box>
          <Typography
            variant='h5'
            noWrap
            component='a'
            href=''
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            LOGO
          </Typography>
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              gap: '24px',
              justifyContent: 'center',
            }}
          >
            <Button
              variant='outlined'
              sx={{
                backgroundColor: 'white',
                ':hover': { backgroundColor: 'white' },
              }}
              onClick={() => handleClickOpen()}
            >
              Create Campaign
            </Button>
            <Button
              variant='outlined'
              sx={{
                backgroundColor: 'white',
                ':hover': { backgroundColor: 'white' },
              }}
              onClick={() => getCampaigns()}
            >
              Get Campaigns
            </Button>
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title='Open settings'>
              <IconButton
                disabled={wallet}
                onClick={connectWallet}
                sx={{ p: 0 }}
              >
                <AccountBalanceWalletIcon
                  sx={{
                    display: { xs: 'none', md: 'flex' },
                    mr: 1,
                    color: 'white',
                    fontSize: '40px',
                  }}
                />
                {!wallet ? (
                  <p style={{ color: 'white' }}>Login</p>
                ) : (
                  <p style={{ color: 'white' }}>Logged In</p>
                )}
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Header;
