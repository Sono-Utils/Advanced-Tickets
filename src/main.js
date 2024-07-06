const { Client, IntentsBitField, EmbedBuilder, REST, Routes } = require('discord.js');
require('dotenv').config();

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildMessages
    ]
});

client.on('ready', ready => {
        console.log(`Logged in as ${client.user.tag}`)

        const commands = [
            {
                name: 'about',
                description: 'Gives you Infomations about the Bot',
            }
        ];
        
        const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
        
        (async () => {
            try {
                console.log('Started refreshing application (/) commands.');
        
                await rest.put(
                    Routes.applicationCommands('1259168067989143602'),
                    { body: commands },
                );
        
                console.log('Successfully reloaded application (/) commands.');
            } catch (error) {
                console.error(error);
            }
        })();
    });

    client.on('interactionCreate', interaction => {
        if(!interaction.isCommand()) return;
    });

    client.login(process.env.TOKEN);