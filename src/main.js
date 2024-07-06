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

const aboutCommand = new EmbedBuilder()
  .setAuthor({
    name: "Advanced Tickets",
    iconURL: "https://cdn.discordapp.com/avatars/1259168067989143602/62e932375b0216b1aa8b43ce109b9c61.webp?size=4096",
  })
  .setTitle("Example Title")
  .setURL("https://example.com")
  .setDescription("Hallo :wave:\n\nIch bin ein Ticket Bot, denn du an allen Ecken einstellen kannst!\n\n> Hier sind meine Commands:")
  .addFields(
    {
      name: "/about",
      value: "Zeigt dieses Embed",
      inline: false
    },
  )
  .setThumbnail("https://cdn.discordapp.com/avatars/1259168067989143602/62e932375b0216b1aa8b43ce109b9c61.webp?size=4096")
  .setColor("#00b0f4")
  .setTimestamp();

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


        const { commandName } = interaction;

        if (commandName === 'about') {
            interaction.reply({embeds: [aboutCommand]});
        }
    });

        

    client.login(process.env.TOKEN);