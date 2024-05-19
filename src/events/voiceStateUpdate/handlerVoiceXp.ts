import { TextChannel, VoiceState } from "discord.js";
import { LoliBotClient } from "../../utils/clients";

import voiceLevelModel from '../../database/models/voiceLvModel';
import extraChannelModel from '../../database/models/extraChannels';
// const Roles = require('../../database/data/roles.json');
import { EmbedBuilder } from 'discord.js';
import { giveReward } from "../../utils/rewarding";

const delay = 1000;
export = async (client: LoliBotClient, oldState: VoiceState, newState: VoiceState) => {
     try {
          if (newState.member?.user.bot) return;

          const userId = newState.member!.id;
          const guildID = newState.guild.id;


          if (newState.channel && !client.timeStampUser.has(userId)) {
               const userVoiceData = await voiceLevelModel.findOne({ userId: userId });
               if (!userVoiceData) return;
               const timeInterVal = setInterval(async () => await addLevel(userId), delay);
               client.timeStampUser.set(userId, timeInterVal);
          }

          const addLevel = async (userId: string) => {
               const xpDefault = configure.levelSystems.xp;
               const userVoiceData = await voiceLevelModel.findOne({ userId: userId });
               if (!userVoiceData) return;
               // const lvl = userVoiceData.level;

               const Time = delay;
               const exp = Time / 100 / 60;
               const generatedXp = Math.floor(Math.random() * xpDefault);
               const generatedXp2 = Math.floor(Math.random() * configure.levelSystems.extraXP);

               const extraChannelData = await extraChannelModel.findOne({ guildId: guildID });
               if (extraChannelData && extraChannelData.voiceChannelId.includes(oldState.channel?.id!)) {
                    userVoiceData.xp += Math.round(generatedXp2 * exp);
                    await userVoiceData.save();
               } else {
                    userVoiceData.xp += Math.round(generatedXp * exp);
                    await userVoiceData.save();
               }

               // if (lvl % 5 === 0) {
               //      if (oldState.member.roles.cache.get(Roles.voiceRoles[lvl]) && !Roles.voiceRoles[lvl]) return;
               //      oldState.member.roles.add(Roles.voiceRoles[lvl]);
               // }

               let nextXP = userVoiceData.level * 2 * 250;
               userVoiceData.nextLevel = nextXP;
               while (userVoiceData.xp >= nextXP) {
                    userVoiceData.xp = userVoiceData.xp - nextXP;
                    userVoiceData.level++;

                    nextXP = userVoiceData.level * 2 * 250;
                    userVoiceData.nextLevel = nextXP;
                    await userVoiceData.save();

                    const channel = client.guilds.cache.get("1070274984116768879")!.channels.cache.get("1102865330499493948") as TextChannel;

                    const levelEmbeds = new EmbedBuilder()
                         .setAuthor({ name: newState.member?.displayName!, iconURL: newState.member?.displayAvatarURL() })
                         .setColor("Random")
                         .setThumbnail(newState.member?.displayAvatarURL()!)
                         .setDescription(`**Chúc mừng** <@${userId}>! Bạn đã lên **Cấp ${userVoiceData.level}** \n ${userVoiceData.level % 5 === 0 ? "Tặng bạn quả role vjp pro" : ""}`);

                    await giveReward(client, userId, userVoiceData.level, levelEmbeds);
                    await channel?.send({ embeds: [levelEmbeds] });
               }
               userVoiceData.totalTime += delay;
               await userVoiceData.save();
          }



          if (oldState.channel?.id && !newState.channel?.id) {
               clearInterval(client.timeStampUser.get(userId));
               client.timeStampUser.delete(userId);
          }
     } catch (error) {
          console.log("There was an error in voice Xp: ", error);
          return;
     }
}

