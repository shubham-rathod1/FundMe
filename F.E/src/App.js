import './App.css';
import React, { useEffect, useState } from 'react';
import idl from './idl.json';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { Program, Provider, utils, web3 } from '@project-serum/anchor';
import { BN } from 'bn.js';
import Grid from '@mui/material/Grid';

// const anchor = require('@project-serum/anchor');

import { Buffer } from 'buffer';
import Header from './core/header';
import {
  createCampaign,
  donation,
  getProvider,
  withdrawFunds,
} from './helper/helper';
import Campaigns from './module/campaigns';
import AlertDialog from './core/dialog';
window.Buffer = Buffer;

// SystemProgram is a reference to the Solana runtime!
const { SystemProgram, Keypair } = web3;
// Create a keypair for the account that will hold the GIF data.
// let baseAccount = Keypair.generate();
// const arr = Object.values(kp._keypair.secretKey);
// const secret = new Uint8Array(arr);
// const baseAccount = web3.Keypair.fromSecretKey(secret);

// Get our program's id from the IDL file.
const programID = new PublicKey(idl.metadata.address);

// Set our network to devnet.
const network = clusterApiUrl('devnet');

// Controls how we want to acknowledge when a transaction is "done".
// how long to wait for the transaction like one node or wait till all node processes it
const opts = {
  preflightCommitment: 'processed',
};

const App = () => {
  const [wallet, setWallet] = useState(null);
  const [solana, setSolana] = useState(null);
  const [campaigns, setCampaigns] = useState([]);

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleWallet = (val) => {
    setWallet(val);
  };
  const handleSolana = (val) => {
    setSolana(val);
  };

  const getCampaigns = async () => {
    try {
      const connection = new Connection(network, opts.preflightCommitment);
      const provider = getProvider(solana);
      const program = new Program(idl, programID, provider);
      Promise.all(
        (await connection.getProgramAccounts(programID)).map(
          async (campaign) => ({
            ...(await program.account.campaign.fetch(campaign.pubkey)),
            Pubkey: campaign.pubkey,
          })
        )
      ).then((campaigns) => setCampaigns(campaigns));
    } catch (error) {
      console.log('from getCampaigns', error);
    }
  };

  useEffect(() => {
    (async () => {
      wallet && getCampaigns();
    })();
  }, [wallet]);

  const withdraw = async (publicKey) => {
    // console.log(publicKey.toString());

    // let valu = prompt('Enter amount to withdraw', 0);
    // valu = Number(valu);
    try {
      const provider = getProvider(solana);
      console.log(programID.toString());
      const program = new Program(idl, programID, provider);
      await program.rpc.withdraw(new BN(0.2 * web3.LAMPORTS_PER_SOL), {
        accounts: {
          campaign: publicKey,
          user: provider.wallet.publicKey,
        },
      });
      console.log('Withdrew some money from:', publicKey.toString());
      getCampaigns();
    } catch (error) {
      console.error('Error withdrawing:', error);
    }
  };

  return (
    <>
      <Header
        handleWallet={handleWallet}
        wallet={wallet}
        handleSolana={handleSolana}
        solana={solana}
        getCampaigns={getCampaigns}
        handleClickOpen={handleClickOpen}
      />
      <AlertDialog
        handleClose={handleClose}
        open={open}
        solana={solana}
        programid={programID}
      />
      <div>
        <div style={{ padding: '24px' }}>
          <Grid container spacing={2}>
            {campaigns.map((item, i) => (
              <Grid item lg={4} key={i}>
                <Campaigns
                  item={item}
                  solana={solana}
                  getCampaigns={getCampaigns}
                />
              </Grid>
            ))}
          </Grid>
        </div>
      </div>
    </>
  );
};
export default App;
