import { EmbedBuilder } from "discord.js";
import { SlashCommands } from "../../cmds";

export = {
     name: "ping",
     description: "pong!",
     // deleted: true,

     callback: async (client, interaction) => {
          const ping = client.ws.ping;

          if (!client.user || !interaction.guild) throw new Error("error in commands");
          const pingEmbed = new EmbedBuilder()
               .setColor('Blurple')
               .setAuthor({ name: `${client.user.username}`, iconURL: client.user.displayAvatarURL() })
               .setDescription(` \`\`\`elm\nAPI Latency (Websocket) : ${Math.round(ping)}ms \nMessage Latency         : ${Math.abs(Date.now() - interaction.createdTimestamp)}ms\`\`\` `)
               .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL() || undefined });

          await interaction.editReply({ embeds: [pingEmbed] });
     },
} as const as SlashCommands