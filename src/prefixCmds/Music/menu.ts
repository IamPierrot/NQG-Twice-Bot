import { PrefixCommands } from "../../cmds";

import { useQueue } from "discord-player";
import { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } from 'discord.js';

export = {
     name: 'menu',
     description: 'hiện lại Menu điều khiển nhạc',
     voiceChannel: true,

     callback: async (client, message, args) => {
          try {
               const queue = useQueue(message.guild!);

               const noMusic = new EmbedBuilder()
                    .setAuthor({ name: 'Không có gì đang phát ấy ? thử lại ikkk.... ❌' })

               if (!queue || !queue.isPlaying()) return await message.reply({ embeds: [noMusic] });

               const track = queue.currentTrack;
               if (!track) return await message.reply({ embeds: [noMusic] });
               const controlEmbed = new EmbedBuilder()
                    .setAuthor({ name: `MENU ĐIỀU KHIỂN`, iconURL: track.requestedBy?.avatarURL() || undefined })
                    .setColor('#4d1aff')
                    .setDescription(`
                         :notes:  **${track.toHyperlink()}** \n \
                         \n \
                         :musical_keyboard: **Tác giả :** \`${track.author}\` \n \
                         :hourglass: **Thời lượng :** \`${track.duration}\` \n \
                         \n \
                         :small_blue_diamond: Được thêm vào bởi ${track.requestedBy?.toString()}
                         `)
                    .setTimestamp()
                    .setFooter({ text: 'Âm nhạc đi trước - Tình yêu theo sau ❤' })

               const back = new ButtonBuilder()
                    .setLabel('Back')
                    .setCustomId('back')
                    .setStyle(ButtonStyle.Primary)

               const skip = new ButtonBuilder()
                    .setLabel('Skip')
                    .setCustomId('skip')
                    .setStyle(ButtonStyle.Primary)

               const stop = new ButtonBuilder()
                    .setLabel('Stop')
                    .setCustomId('stop')
                    .setStyle(ButtonStyle.Danger)

               const loop = new ButtonBuilder()
                    .setLabel('Loop')
                    .setCustomId('loop')
                    .setStyle(ButtonStyle.Secondary)

               const queueTracks = new ButtonBuilder()
                    .setLabel('Queue')
                    .setCustomId('queueTracks')
                    .setStyle(ButtonStyle.Secondary)

               const history = new ButtonBuilder()
                    .setLabel('History')
                    .setCustomId('history')
                    .setStyle(ButtonStyle.Primary);
               const resumePause = new ButtonBuilder()
                    .setLabel('Resume & Pause')
                    .setCustomId('resume&pause')
                    .setStyle(ButtonStyle.Danger)
               const lyrics = new ButtonBuilder()
                    .setLabel('Lyrics')
                    .setCustomId('lyrics')
                    .setStyle(ButtonStyle.Primary)
               const volumeUp = new ButtonBuilder()
                    .setLabel('Volume Up')
                    .setCustomId('volumeup')
                    .setStyle(ButtonStyle.Secondary)
               const volumeDown = new ButtonBuilder()
                    .setLabel('Volume Down')
                    .setCustomId('volumedown')
                    .setStyle(ButtonStyle.Secondary)

               const row2 = new ActionRowBuilder<ButtonBuilder>().addComponents(back, volumeDown, stop, volumeUp, skip);
               const row1 = new ActionRowBuilder<ButtonBuilder>().addComponents(history, loop, resumePause, queueTracks, lyrics);


               await message.reply({ embeds: [controlEmbed], components: [row1, row2] })
                    .then((msg) => setTimeout(() => msg.delete(), 30000))

          } catch (error) {
               console.log(error);
          }
     }
} as const as PrefixCommands;