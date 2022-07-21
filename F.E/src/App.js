import './App.css';
import { useEffect, useState } from 'react';
import idl from './idl.json';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { Program, Provider, utils, web3 } from '@project-serum/anchor';
import { BN } from 'bn.js';
// const anchor = require('@project-serum/anchor');

import { Buffer } from 'buffer';
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

  const getProvider = () => {
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = new Provider(connection, solana, opts.preflightCommitment);
    return provider;
  };

  const checkWalletConnection = async () => {
    try {
      const { solana } = window;
      if (solana.isPhantom) {
        setSolana(solana);
        console.log('Phantom wallet found');
        const result = await solana.connect({ onlyIfTrusted: true });
        const key = result.publicKey.toString();
        console.log(key);
        setWallet(key);
      } else {
        alert('No phantom wallet found');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const connectWallet = async () => {
    console.log(solana);
    const result = await solana.connect();
    const key = await result.publicKey.toString();
    setWallet(key);
    console.log(key);
  };

  useEffect(() => {
    const onLoad = async () => {
      await checkWalletConnection();
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  // const createCampaign = async () => {
  //   try {
  //     const provider = getProvider();
  //     const program = new Program(idl, programID, provider);
  //     // as we are using derived account we cannot use random generated wallet;
  //     // we have to use specific address that is calculted for our campaign;
  //     const [campaign] = await PublicKey.findProgramAddress(
  //       [
  //         utils.bytes.utf8.encode('CAMPAIGN_DEMO'),
  //         provider.wallet.publicKey.toBuffer(),
  //       ],
  //       program.programId
  //     );
  //     // create our accounts
  //     // create campaign function call;
  //     // const val = new anchor.BN(0.1);
  //     console.log(campaign.toString());
  //     await program.rpc.createCampaign('shubham', 'desc', {
  //       accounts: {
  //         campaign,
  //         user: provider.wallet.publicKey,
  //         systemProgram: SystemProgram.programId,
  //       },
  //     });
  //     console.log('created a campaign with address', campaign.toString());
  //   } catch (error) {
  //     console.log('from create campaign', error);
  //   }
  // };

  const createCampaign = async () => {
    try {
      const provider = getProvider();
      const program = new Program(idl, programID, provider);
      const [campaign] = await PublicKey.findProgramAddress(
        [
          utils.bytes.utf8.encode('CAMPAIGN_DEMO'),
          utils.bytes.utf8.encode('slug-1'),
          provider.wallet.publicKey.toBuffer(),
        ],
        program.programId
      );
      await program.rpc.createCampaign(
        'campaign name',
        'campaign description',
        {
          accounts: {
            campaign,
            user: provider.wallet.publicKey,
            systemProgram: SystemProgram.programId,
          },
        }
      );
      console.log('Created a new campaign w/ address:', campaign.toString());
    } catch (error) {
      console.error('Error creating campaign account:', error);
    }
  };

  const getCampaigns = async () => {
    try {
      const connection = new Connection(network, opts.preflightCommitment);
      const provider = getProvider();
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

  const donation = async (publicKey) => {
    console.log(publicKey.toString());
    try {
      const provider = getProvider();
      const program = new Program(idl, programID, provider);
      await program.rpc.donate(new BN(0.2 * web3.LAMPORTS_PER_SOL), {
        accounts: {
          campaign: publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
      });
      console.log('donate', publicKey.toString());
      getCampaigns();
    } catch (error) {
      console.log('from donate', error);
    }
  };

  const withdrawFunds = async (publicKey) => {
    try {
      const provider = getProvider();
      const program = new Program(idl, programID, provider);
      await program.rpc.withdraw(new BN(0.2 * web3.LAMPORTS_PER_SOL), {
        accounts: {
          campaign: publicKey,
          user: provider.wallet.publicKey,
        },
      });
      console.log('Withdrew some money from:', publicKey.toString());
    } catch (error) {
      console.error('Error withdrawing:', error);
    }
  };

  console.log(campaigns);
  return (
    <>
      {!wallet && (
        <div>
          <h3>please authorize your wallet</h3>
          <button onClick={connectWallet}>Connect</button>
        </div>
      )}
      <div>{<button onClick={createCampaign}>Create Campaign</button>}</div>
      <div>{<button onClick={getCampaigns}>Get Campaign</button>}</div>
      <div>
        {campaigns.map((item, i) => {
          return (
            <div key={i}>
              <p>Campaign Id: {item.Pubkey.toString()}</p>
              <p>Campaign name: {item.name}</p>
              <p>Campaign minContribution: {item.minContribution.toString()}</p>
              <p>Campaign admin: {item.admin.toString()}</p>
              <p>
                Balance: {(item.donation / web3.LAMPORTS_PER_SOL).toString()}
              </p>
              <button onClick={() => donation(item.Pubkey)}>Donate</button>
              <button onClick={() => withdrawFunds(item.Pubkey)}>
                Withdraw
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
};
export default App;
