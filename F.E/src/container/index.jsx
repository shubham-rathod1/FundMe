import React from 'react';

export default function Home() {
  const [wallet, setWallet] = useState(null);
  const [solana, setSolana] = useState(null);
  const [campaigns, setCampaigns] = useState([]);

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

  return <div>Home</div>;
}
