import { PrefixCommands } from "../../cmds";

import { useQueue, QueueRepeatMode } from 'discord-player';
import { EmbedBuilder } from 'discord.js';

export = {
     name: 'forceskip',
     description: 'bắt buộc skip bài đang phát',
     DJPermissions: true,
     voiceChannel: false,

     callback: async (client, message, args) => {
          try {
               const queue = useQueue(message.guild!);
               const noMusic = new EmbedBuilder()
                    .setAuthor({ name: 'Không có gì đang phát ấy ? thử lại ikkk.... ❌' })
               if (!queue || !queue.isPlaying()) return await message.reply({ embeds: [noMusic] });
               
               
               queue.setRepeatMode(QueueRepeatMode.OFF);
               queue.node.skip();
     
               const skipEmbed = new EmbedBuilder()
                    .setAuthor({ name: `⏭ Đã bỏ qua bài nhạc đang phát ${queue.currentTrack?.title} `});
     
               await message.reply({ embeds: [skipEmbed] });
               
          } catch (error) {
               console.log("There was an error in forceskip: ", error);
          }
     }
} as const as PrefixCommands;