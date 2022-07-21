use anchor_lang::prelude::*;
use anchor_lang::solana_program::entrypoint::ProgramResult;

declare_id!("9RWYAiFs9crPQiUu9tHrahZmpkbuAycgJ2LZ1zKoeZ3E");

#[program]
pub mod fund_me {
    use super::*;

    pub fn create_campaign(
        ctx: Context<CreateCampaign>,
        name: String,
        description: String,
    ) -> ProgramResult {
        let campaign = &mut ctx.accounts.campaign;
        campaign.name = name;
        campaign.description = description;
        campaign.donation = 0;
        campaign.admin = *ctx.accounts.user.key;
        Ok(())
    }

    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> ProgramResult {
        let campaign = &mut ctx.accounts.campaign;
        let user = &mut ctx.accounts.user;
        if campaign.admin != *user.key {
            return Err(ProgramError::IncorrectProgramId);
        }
        // calculte rent balance;
        let rent_balance = Rent::get()?.minimum_balance(campaign.to_account_info().data_len());
        if **campaign.to_account_info().lamports.borrow() - rent_balance < amount {
            return Err(ProgramError::InsufficientFunds);
        }
        **campaign.to_account_info().try_borrow_mut_lamports()? -= amount;
        **user.to_account_info().try_borrow_mut_lamports()? += amount;
        Ok(())
    }
    // donate function
    pub fn donate(ctx: Context<Donate>, amount: u64) -> ProgramResult {
        // here funds are sent from users wallet
        // here program has no authority over exteranl account so system program gives authority
        // and we can do that via system instrucitons.
        let ix = anchor_lang::solana_program::system_instruction::transfer(
            // specify from address
            &ctx.accounts.user.key(),
            // to
            &ctx.accounts.campaign.key(),
            amount,
        );
        // now execute this instructions
        anchor_lang::solana_program::program::invoke(
            &ix,
            &[
                ctx.accounts.user.to_account_info(),
                ctx.accounts.campaign.to_account_info(),
            ],
        );
        (&mut ctx.accounts.campaign).donation += amount;
        Ok(())
    }
}

//deriving from accounts and represents the context
#[derive(Accounts)]
#[instruction(post: Post)]

pub struct CreateCampaign<'info> {
    // create program derived account;
    // adds bump to add 8 bit bump to the hash function until we don't find unused wallet
    #[account(init, payer=user, space=10000, seeds=[b"CAMPAIGN_DEMO".as_ref(), post.slug.as_ref(), user.key().as_ref()],bump)]
    pub campaign: Account<'info, Campaign>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut)]
    pub campaign: Account<'info, Campaign>,
    #[account(mut)]
    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct Donate<'info> {
    #[account(mut)]
    pub campaign: Account<'info, Campaign>,
    #[account(mut)]
    pub user: Signer<'info>,
    // to authrize users to send money from external account
    pub system_program: Program<'info, System>,
}

#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct Post {
    pub slug: String,
}

#[account]
pub struct Campaign {
    pub admin: Pubkey,
    pub name: String,
    pub description: String,
    pub donation: u64,
    pub min_contribution: u64,
}
