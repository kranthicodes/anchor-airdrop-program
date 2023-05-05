# SPL token airdrop program

This Solana program is a token airdrop program that initializes a new mint and when airdrop instruction is called, it makes a CPI to TokenProgram and mints to the user provided Associated token account.
## Description

This Solana program is a contract written in Rust, a programming language used for developing smart contracts on the Solana blockchain. This program was created using Anchor framework.

**initialize_mint**

This function accepts decimals as input to initialize a mint account.

**airdrop**

This function accepts amount as input to airdrop tokens from Mint to user provided ATA by making CPI call to token program.


Sai Kranthi
[@iamsaikranthi](https://twitter.com/iamsaikranthi)


## License

This project is licensed under the MIT License - see the LICENSE.md file for details
