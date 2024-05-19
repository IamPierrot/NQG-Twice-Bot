import { Message, TextChannel } from "discord.js";
import { LoliBotClient } from "../../utils/clients";

import { EmbedBuilder } from 'discord.js';
import chatLevelModel from '../../database/models/chatLvModel';
// import Roles from '../../database/data/roles.json';
import extraChannelModel from '../../database/models/extraChannels';
import { giveReward } from "../../utils/rewarding";

const talkedRecently = new Set<string>();
export = async (client: LoliBotClient, message: Message) => {
     try {
          if (message.author.bot || !message.guild || !message.inGuild() || talkedRecently.has(message.author.id)) return;
          const chatData = await chatLevelModel.findOne({ userId: message.author.id });

          if (!chatData) return;
          // const lvl = String(chatData.level);

          const extraChannelData = await extraChannelModel.findOne({ guildId: message.guildId });
          let getXpDefault = configure.levelSystems.xp;
          let getCooldownfromDB = configure.levelSystems.cooldown;

          const generatedXp = Math.floor(Math.random() * getXpDefault);
          const generatedXp2 = Math.floor(Math.random() * configure.levelSystems.extraXP);


          const messageContents = message.content.split(" ");
          if (messageContents.length < 2) {
               return;
          } else {
               if (extraChannelData && extraChannelData.chatChannelId?.includes(message.channel.id)) {
                    chatData.xp += generatedXp2;
               } else {
                    chatData.xp += generatedXp;
               }
               chatData.totalText += messageContents.length;

               let nextXP = chatData.level * 2 * 250;
               const channel = client.guilds.cache.get("1070274984116768879")?.channels.cache.get("1102865330499493948") as TextChannel;
               
               while (chatData.xp >= nextXP) {

                    chatData.xp = chatData.xp - nextXP;
                    chatData.level++;
                    nextXP = chatData.level * 2 * 250;
                    chatData.nextLevel = nextXP;
                    await chatData.save();

                    const levelEmbeds = new EmbedBuilder()
                         .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                         .setColor("Random")
                         .setThumbnail(message.author.displayAvatarURL())
                         .setDescription(`**Chúc mừng** ${message.author}! Bạn đã lên **Cấp ${chatData.level}** \n ${chatData.level % 5 === 0 ? "Tặng bạn quả role vjp pro" : ""}`);

                    await giveReward(client, message.author.id, chatData.level, levelEmbeds);
                    await channel?.send({ embeds: [levelEmbeds] });
               }

               talkedRecently.add(message.author.id);
               setTimeout(() => talkedRecently.delete(message.author.id), getCooldownfromDB)
               await chatData.save();
          }
          // if (lvl % 5 === 0) {
          //      if (message.member?.roles.cache.get(Roles.ChatRoles[lvl]) && Roles.ChatRoles[lvl]) return;
          //      await message.member.roles.add(Roles.ChatRoles[lvl]);
          // }

          await chatData.save();

     } catch (error) {
          console.log("There was an error in handler XP: ", error);
     }
}