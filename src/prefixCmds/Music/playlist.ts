import { PrefixCommands } from "../../cmds";

import { EmbedBuilder } from 'discord.js';
import { useMainPlayer, QueryType } from 'discord-player';


export = {
     name: 'playlist',
     description: 'Chơi 1 playlist!',
     aliases: ['pl'],
     voiceChannel: true,

     callback: async (client, message, args) => {
          const player = useMainPlayer();

          const song = args[0];
          let res = await player.search(song, {
               requestedBy: message.member!,
               searchEngine: QueryType.YOUTUBE_PLAYLIST,
          });

          const NoResultsEmbed = new EmbedBuilder()
               .setAuthor({ name: `Không tìm thấy playlist hoặc playlist đang ở chế độ private.... thử lại? ❌` })
               .setColor('#2f3136')

          if (!res || !res.playlist) return await message.reply({ embeds: [NoResultsEmbed] });

          const queue = player.nodes.create(message.guildId!, { //guildQueue
               metadata: message.channel,
               // spotifyBridge: configure.opt.spotifyBridge,
               volume: configure.opt.volume,
               leaveOnEmpty: configure.opt.leaveOnEmpty,
               leaveOnEmptyCooldown: configure.opt.leaveOnEmptyCooldown,
               leaveOnEnd: configure.opt.leaveOnEnd,
               leaveOnEndCooldown: configure.opt.leaveOnEndCooldown,
          });
          try {
               if (!queue.connection) await queue.connect(message.member!.voice.channel!);
          } catch {
               try {
                    player.queues.delete(message.guildId!);
               } catch { }

               const NoVoiceEmbed = new EmbedBuilder()
                    .setAuthor({ name: `Mình không thể kết nối được với voice channel.... thử lại ? ❌` })
                    .setColor('Red')

               return await message.reply({ embeds: [NoVoiceEmbed] });
          }

          if (!queue.metadata) queue.metadata = message.channel;


          console.log(res.playlist);
          
          const playlist = res.playlist;
          queue.addTrack(playlist);

          if (!queue.isPlaying()) {
               await queue.node.play();
          }

          const playEmbed = new EmbedBuilder()
               .setAuthor({ name: `🎧 ĐÃ THÊM VÀO HÀNG PHÁT`, iconURL: message.author.avatarURL()! })
               .setColor('#4d1aff')
               .setDescription(`
               :notes:  **${playlist.title}** \n \
               \n \
               :small_blue_diamond: Được thêm vào bởi : ${message.author.toString()} 
               :small_blue_diamond: Nguồn tìm kiếm : ${playlist.source.toString()}
               `)
               .setTimestamp()
               .setFooter({ text: 'Âm nhạc đi trước - Tình yêu theo sau ❤️' })


          await message.reply({ embeds: [playEmbed] });


     }
} as const as PrefixCommands;