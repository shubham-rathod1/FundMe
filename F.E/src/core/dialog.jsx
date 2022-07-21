import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { createCampaign } from '../helper/helper';
import { TextField } from '@mui/material';

export default function AlertDialog({ solana, handleClose, open }) {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  // console.log("proid", programid.toString());

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>
          {'Enter Details to create campaign'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            <TextField
              sx={{ padding: '10px', marginTop: '10px' }}
              placeholder='name'
              variant='outlined'
              label='Name'
              size='medium'
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
            <TextField
              sx={{ padding: '10px', marginTop: '10px' }}
              placeholder='description'
              variant='outlined'
              label='Description'
              size='medium'
              onChange={(e) => setDesc(e.target.value)}
              value={desc}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button onClick={() => createCampaign(solana, name, desc)}>
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
