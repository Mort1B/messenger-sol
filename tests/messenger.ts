import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { assert } from "chai";
import { Messenger } from "../target/types/messenger";

describe("Testing our messaging app", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());


  const program = anchor.workspace.Messenger as Program<Messenger>;
  const anchorProvider = program.provider as anchor.AnchorProvider;

  it("Is initialized!", async () => {
    // Add your test here.
    const baseAccount  = anchor.web3.Keypair.generate();
    await program.rpc.initialize("My first message", {
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: anchorProvider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [baseAccount]
    });

    const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    console.log("Data: ", account.data);
    assert.ok(account.data === "My first message");

  });

  it("Update the account prev created:", async () => {

    const baseAccount = anchor.web3.Keypair.generate(); 

    await program.rpc.update("My second message", {
        accounts: {
            baseAccount: baseAccount.publicKey
        }
    })

    const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    console.log("Updated data:", account.data);
    assert.ok(account.data === "My second message");
    console.log("All account data: ", account);
    console.log("All data: ", account.dataList);
    assert.ok(account.dataList.length === 2);

  })
});
