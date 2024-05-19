import { EmbedBuilder, GuildMember, Interaction } from "discord.js";
import { LoliBotClient } from "../../utils/clients";
import extraChannelModel from "../../database/models/extraChannels";

export = async (client: LoliBotClient, interaction: Interaction) => {
     try {
          
          if (!interaction.isChatInputCommand()) return;
          await interaction.deferReply();
     
          if (!(await extraChannelModel.findOne({ guildId: interaction.guildId! }))) await new extraChannelModel({ guildId: interaction.guildId }).save();
          const commandObject = client.slashCommands.find(
               (cmd) => cmd.name === interaction.commandName
          );
     
          if (!commandObject) return;
     
          if (commandObject?.adminOnly && !configure.opt.idDev.includes(interaction.user.id)) return await interaction.editReply({
               embeds: [
                    new EmbedBuilder().setTitle("❌ | Bạn đang không có quyền dùng lệnh này!").setColor('Red')
               ]
          }).then(() => { setTimeout(() => interaction.deleteReply()), 10000 });     
          const member = interaction.member as GuildMember;
     
          if (commandObject.voiceChannel) {
               if (!member.voice.channel) {
                    return await interaction.editReply({
                         embeds: [new EmbedBuilder()
                              .setColor('#ff0000')
                              .setDescription(`❌ | Bạn đang không ở trong phòng Voice`)]
                    })
     
               }
               if (interaction.guild?.members?.me?.voice.channel && member.voice.channel.id !== interaction.guild.members.me.voice.channel.id) {
                    return await interaction.editReply({
                         embeds: [new EmbedBuilder()
                              .setColor('#ff0000')
                              .setDescription(`❌ | Bạn đang không ở cùng phòng voice với tui! `)],
                    })
               }
          }
     
          // if (commandObject.permissionsRequired?.length) {
          //      for (const permission of commandObject.permissionsRequired) {
          //           if (!interaction.member.permissions.has(permission)) {
          //                interaction.editReply({
          //                     content: 'Not enough permissions.',
          //                     ephemeral: true,
          //                });
          //                return;
          //           }
          //      }
          // }
     
          // if (commandObject.botPermissions?.length) {
          //      for (const permission of commandObject.botPermissions) {
          //           const bot = interaction.guild.members.me;
     
          //           if (!bot.permissions.has(permission)) {
          //                interaction.editReply({
          //                     content: "I don't have enough permissions.",
          //                     ephemeral: true,
          //                });
          //                return;
          //           }
          //      }
          // }
          await commandObject.callback(client, interaction);
     } catch (error) {
          console.log("There was an error in interaction: ", error);
     }
}