import fs from "mz/fs";
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AirdropProgram } from "../target/types/airdrop_program";
import { Keypair, SystemProgram, PublicKey } from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  getOrCreateAssociatedTokenAccount,
} from "@solana/spl-token";

/**
 * Create a Keypair from a secret key stored in file as bytes' array
 */
export async function createKeypairFromFile(
  filePath: string
): Promise<Keypair> {
  const secretKeyString = await fs.readFile(filePath, { encoding: "utf8" });
  const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
  return Keypair.fromSecretKey(secretKey);
}

describe("airdrop-program", async () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());
  const provider = anchor.AnchorProvider.env();
  const program = anchor.workspace.AirdropProgram as Program<AirdropProgram>;

  // derive PDA of the token mint and mint authority using our seeds
  let tokenMint = await PublicKey.findProgramAddress(
    [Buffer.from("token-mint")],
    program.programId
  );
  const mintAuthority = await PublicKey.findProgramAddress(
    [Buffer.from("mint-authority")],
    program.programId
  );
  console.log("Token mint pda: ", tokenMint[0].toBase58());
  console.log("Mint auth pda: ", mintAuthority[0].toBase58());

  it("Create Mint", async () => {
    const tx = await program.methods
      .initializeMint(10)
      .accounts({
        tokenMint: tokenMint[0],
        mintAuthority: mintAuthority[0],
        payer: provider.wallet.publicKey,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .signers([])
      .rpc();
    console.log("Initialize mint tx:", tx);
  });

  it("Airdrop tokens", async () => {
    const payer = await createKeypairFromFile(
      "/Users/dexter/.config/solana/devnet.json"
    );

    let userTokenAccount = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      payer,
      tokenMint[0],
      new PublicKey("C4rYug44LyJBcYQPgTBC7uy52rzWvoBo4tC1p2DvkNmj")
    );

    const tx = await program.methods
      .airdrop(new anchor.BN(12))
      .accounts({
        tokenMint: tokenMint[0],
        mintAuthority: mintAuthority[0],
        user: provider.wallet.publicKey,
        userTokenAccount: userTokenAccount.address,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([])
      .rpc();
    console.log("Airdrop tx:", tx);
  });

  it("Airdropping more tokens", async () => {
    const payer = await createKeypairFromFile(
      "/Users/dexter/.config/solana/devnet.json"
    );

    let userTokenAccount = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      payer,
      tokenMint[0],
      provider.wallet.publicKey
    );

    const tx = await program.methods
      .airdrop(new anchor.BN(25))
      .accounts({
        tokenMint: tokenMint[0],
        mintAuthority: mintAuthority[0],
        user: provider.wallet.publicKey,
        userTokenAccount: userTokenAccount.address,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([])
      .rpc();
    console.log("Airdrop tx:", tx);
  });
});
