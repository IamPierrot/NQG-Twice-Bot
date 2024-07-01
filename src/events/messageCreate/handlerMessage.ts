import { Collection, EmbedBuilder, Message, PermissionsBitField } from "discord.js";
import { LoliBotClient } from "../../utils/clients";
import userModel from "../../database/models/userModel";
import extraChannelModel from "../../database/models/extraChannels";

export = async (client: LoliBotClient, message: Message) => {
     try {
          if (message.author.bot) return;
          if (!(await extraChannelModel.findOne({ guildId: message.guildId! }))) await new extraChannelModel({ guildId: message.guildId! }).save();

          const checkPrefix = (prefix: string): boolean => message.content.toLowerCase().startsWith(prefix.toLowerCase());
          
          let prefix = client.prefix;
          const prefixAuth = await client.getPrefix(message.guildId!);
          if (prefixAuth && !checkPrefix(prefix)) prefix = prefixAuth;

          if (!checkPrefix(prefix)) return;

          const args = message.content.slice(prefix.length).trim().split(/ +/);
          const command = args.shift()!.toLowerCase();

          const commandObject = client.prefixCommands.find(
               (cmd) => cmd.name === command || cmd.aliases?.includes(command)
          );
          if (!commandObject || !message.member) return;
          const userData = await userModel.findOne({ userId: message.author.id });
          if (client.economyAndCasino.includes(commandObject.name) && !userData) return await message.reply("Bạn cần dùng nqgm register để đăng ký tài khoản khi sử dụng lệnh này!");

          if (!client.cooldowns.has(commandObject.name)) {
               client.cooldowns.set(commandObject.name, new Collection());
          }
          const timestamps = client.cooldowns.get(commandObject.name);
          const cooldownAmount = (commandObject.cooldowns || 1) * 1000;
          const now = Date.now();

          if (timestamps) {
               if (timestamps.has(message.author.id)) {
                    const expirationTime = timestamps.get(message.author.id)! + cooldownAmount;
     
                    if (now < expirationTime) {
                         const timeLeftInSeconds = Math.floor((expirationTime - now) / 1000);
                         const hours = Math.floor(timeLeftInSeconds / 3600);
                         const minutes = Math.floor((timeLeftInSeconds % 3600) / 60);
                         const seconds = timeLeftInSeconds % 60;
     
                         let timeLeftString = "";
                         if (hours > 0) {
                              timeLeftString += `${hours} giờ `;
                         }
                         if (minutes > 0) {
                              timeLeftString += `${minutes} phút `;
                         }
                         if (seconds > 0) {
                              timeLeftString += `${seconds} giây `;
                         }
     
                         return message.reply(`Vui lòng chờ ${timeLeftString}để dùng lại lệnh \`${commandObject.name}\``)
                              .then((msg) => {
                                   setTimeout(() => {
                                        msg.delete();
                                   }, 5000);
                              });;
                    }
               }
     
               timestamps.set(message.author.id, now);
               setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
          }
          
          if (commandObject?.adminOnly && (!configure.opt.idDev.includes(message.author.id))) return message.reply("Bạn không có quyền dùng lệnh này!");

          if (commandObject?.DJPermissions && (!message.member.permissions.has([PermissionsBitField.Flags.MoveMembers, PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.MuteMembers]))) return message.reply("Bạn không có quyền dùng lệnh này!");
          if (commandObject?.voiceChannel) {
               if (!message.member.voice.channel) return await message.reply({ embeds: [new EmbedBuilder().setColor('#ff0000').setDescription(`❌ | Bạn đang không ở trong phòng Voice`)] })
               if (message.guild!.members.me?.voice.channel && message.member.voice.channel.id !== message.guild!.members.me.voice.channel.id) return await message.reply({ embeds: [new EmbedBuilder().setColor('#ff0000').setDescription(`❌ | Bạn đang không ở cùng phòng voice với tui! `)] })
          }

          return await commandObject.callback(client, message, args);
     } catch (error) {
          console.log(`There was an error in message handler: ${error}`)
     }

}