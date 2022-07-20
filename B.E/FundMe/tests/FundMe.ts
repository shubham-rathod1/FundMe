import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { FundMe } from "../target/types/fund_me";

describe("FundMe", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.FundMe as Program<FundMe>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
