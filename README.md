# BanBot

A Discord bot for banning people by ID. That's it, that's the description.

## Usage

Basically any moderation bot already has this built in, so if you got one of those, just use that.

<details>
<summary>But…</summary>

If you insist on making this mess work since you do not wish to install a full-blown bot just for this simple feature that should just be built in to the client, here's how:

1. Create an app via Discord's developer portal
2. Copy `.env.example` to `.env`, fill in the bot token and client ID
3. `npm run start`
4. Add the bot to any server you want to ban users on (use the bot authorization scope)
5. Give it sufficient permissions to do so (i.e. manage users permission)
6. Run the `/ban` slash command from any channel in the server 
</details>

## Help & Support

No.
