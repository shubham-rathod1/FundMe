import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { Program, Provider, utils, web3 } from '@project-serum/anchor';
import idl from '../idl.json';
import { BN } from 'bn.js';

// Set our network to devnet.
const network = clusterApiUrl('devnet');
const programID = new PublicKey(idl.metadata.address);
console.log("helper", programID.toString())
const { SystemProgram, Keypair } = web3;

// Controls how we want to acknowledge when a transaction is "done".
// how long to wait for the transaction like one node or wait till all node processes it
const opts = {
  preflightCommitment: 'processed',
};

export const getProvider = (solana) => {
  const connection = new Connection(network, opts.preflightCommitment);
  const provider = new Provider(connection, solana, opts.preflightCommitment);
  return provider;
};

export const createCampaign = async (solana, name, desc) => {
  try {
    const provider = getProvider(solana);
    const program = new Program(idl, programID, provider);
    const [campaign] = await PublicKey.findProgramAddress(
      [
        utils.bytes.utf8.encode('CAMPAIGN_DEMO'),
        utils.bytes.utf8.encode('slug-1'),
        provider.wallet.publicKey.toBuffer(),
      ],
      program.programId
    );
    await program.rpc.createCampaign(name, desc, {
      accounts: {
        campaign,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
    });
    console.log('Created a new campaign w/ address:', campaign.toString());
  } catch (error) {
    console.error('Error creating campaign account:', error);
  }
};

export const donation = async (publicKey, solana, getCampaigns) => {
  console.log(publicKey.toString());
  let val = prompt('Enter amount to donate', 0);
  val = Number(val);
  try {
    const provider = getProvider(solana);
    console.log(programID.toString())
    const program = new Program(idl, programID, provider);
    await program.rpc.donate(new BN(val * web3.LAMPORTS_PER_SOL), {
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

export const withdrawFunds = async (publicKey, solana, getCampaigns) => {
  console.log(publicKey.toString());

  let valu = prompt('Enter amount to withdraw', 0);
  valu = Number(valu);
  try {
    const provider = getProvider(solana);
    console.log(programID.toString())
    const program = new Program(idl, programID, provider);
    await program.rpc.withdraw(new BN(valu * web3.LAMPORTS_PER_SOL), {
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
