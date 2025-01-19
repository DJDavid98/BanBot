import { Routes } from 'discord-api-types/v9';
import {
	Client,
	GatewayIntentBits,
	CommandInteraction,
	SlashCommandBuilder,
	REST, PermissionsBitField, BitFieldResolvable, GatewayIntentsString,
} from 'discord.js';
import { config } from 'dotenv';

config();

const token = process.env.DISCORD_BOT_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;
const commands = [
	new SlashCommandBuilder()
		.setName('ban')
		.setDescription('Ban a user by their ID')
		.addStringOption(option => option.setName('userid').setDescription('The ID of the user to ban').setRequired(true))
		.setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
].map(command => command.toJSON());
const rest = new REST({ version: '9' }).setToken(token);
(async () => {
	try {
		await rest.put(Routes.applicationCommands(clientId), { body: commands });
		console.log('Successfully registered application commands globally.');
	} catch (error) {
		console.error(error);
	}
})();

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildModeration
	] as BitFieldResolvable<GatewayIntentsString, number>
});
client.once('ready', () => {
	console.log('Ready!');
});
client.on('interactionCreate', async (interaction: CommandInteraction) => {
	if (!interaction.isCommand()) return;
	const { commandName, options } = interaction;
	if (commandName === 'ban') {
		const userId = options.getString('userid');
		await interaction.deferReply();
		try {
			const response = await fetch(`https://discord.com/api/v9/guilds/${interaction.guildId}/bans/${userId}`, {
				method: 'PUT',
				headers: { 'Authorization': `Bot ${token}`, 'Content-Type': 'application/json' },
				body: JSON.stringify({ reason: 'Banned by bot command' }),
			});
			if (response.ok) {
				await interaction.reply(`User with ID ${userId} has been banned.`);
			} else {
				const error = await response.json();
				await interaction.reply(`Failed to ban user: ${error.message}`);
			}
		} catch (error) {
			console.error(error);
			await interaction.reply(`An error occurred while trying to ban the user.`);
		}
	}
});
client.login(token);
