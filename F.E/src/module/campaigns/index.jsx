import React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { donation, withdrawFunds } from '../../helper/helper';
import { web3 } from '@project-serum/anchor';

export default function Campaigns({ item, getCampaigns, solana }) {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        component='img'
        height='200'
        image='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShU5cTFx9uH-ZNjEIGvT0MqUnZCSpFSdEgP52-19O4cw6T1ACc5r96lR9DumKEIy0a2qY&usqp=CAU'
        alt={item.name}
      />
      <CardContent>
        <Typography gutterBottom variant='h5' component='div'>
          Funded: {(item.donation / web3.LAMPORTS_PER_SOL).toString()}
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          {item.description}
        </Typography>
        <Typography
          sx={{
            width: '310px',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}
          variant='body2'
          color='text.secondary'
        >
          {` Id: ${item.Pubkey.toString()}`}
        </Typography>

        <Typography
          sx={{
            width: '310px',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}
          variant='body2'
          color='text.secondary'
        >
          {`Address: ${item.admin.toString()}`}
        </Typography>
      </CardContent>
      <CardActions sx={{ display: 'flex', justifyContent: 'space-around' }}>
        <Button
          variant='contained'
          onClick={() => donation(item.Pubkey, solana, getCampaigns)}
          size='medium'
        >
          Fund
        </Button>
        <Button
          variant='contained'
          onClick={() => withdrawFunds(item.Pubkey, solana, getCampaigns)}
          size='medium'
        >
          Withdraw
        </Button>
      </CardActions>
    </Card>
  );
}
