const { Client, IntentsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField, REST, Routes } = require('discord.js');
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
            },
            {
                name: 'ticket-embed',
                description: 'Shows the Ticket Embed'
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


        const { commandName, member } = interaction;

        if (commandName === 'about') {
              interaction.reply({embeds: [aboutCommand]});
            } else if(commandName === 'ticket-embed') {
            if(!member.permissions.has('ADMINISTRATOR')) {
                const ticketCreateEmbed = new EmbedBuilder()
                  .setTitle('Ticket System')
                  .setDescription('Klicke auf den Button unten, um ein Ticket zu erstellen.');
            
                const ticketCreateButton = new ActionRowBuilder()
                  .addComponents(
                    new ButtonBuilder()
                      .setCustomId('create_ticket')
                      .setLabel('Ticket erstellen')
                      .setStyle(ButtonStyle.Primary)
                  );
            
                message.channel.send({ embeds: [ticketCreateEmbed], components: [ticketCreateButton] })
            }
        }   
    });
      
      client.on('interactionCreate', async (interaction) => {
        if (!interaction.isButton()) return;
      
        if (interaction.customId === 'create_ticket') {
          const ticketChannel = await interaction.guild.channels.create({
            name: `ticket-${interaction.user.username}`,
            type: 0, // 0 steht für GUILD_TEXT (Textkanal)
            permissionOverwrites: [
              {
                id: interaction.guild.id,
                deny: [PermissionsBitField.Flags.ViewChannel],
              },
              {
                id: interaction.user.id,
                allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory],
              },
              {
                id: client.user.id,
                allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory],
              },
            ],
          });
      
          const ticketEmbed = new EmbedBuilder()
            .setTitle('Ticket')
            .setDescription('Ein Mitarbeiter wird bald bei dir sein.\nKlicke auf den Button unten, um das Ticket zu schließen.');
      
          const closeButton = new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setCustomId('close_ticket')
                .setLabel('Ticket schließen')
                .setStyle(ButtonStyle.Danger)
            );
      
          await ticketChannel.send({ embeds: [ticketEmbed], components: [closeButton] });
      
          await interaction.reply({ content: `Dein Ticket wurde erstellt: ${ticketChannel}`, ephemeral: true });
        } else if (interaction.customId === 'close_ticket') {
          await interaction.channel.delete();
        }
      });
      

        

    client.login(process.env.TOKEN);