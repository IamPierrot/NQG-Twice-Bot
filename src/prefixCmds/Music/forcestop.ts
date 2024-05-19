import { PrefixCommands } from "../../cmds";

import { useQueue } from 'discord-player';
import { EmbedBuilder } from 'discord.js';

export = {
     name: 'forcestop',
     description: 'bắt buộc dừng bài đang phát',
     DJPermissions: true,
     voiceChannel: false,
     
     callback: async (client, message, args) => {
          try {
               const queue = useQueue(message.guild!);
               const noMusic = new EmbedBuilder()
                    .setAuthor({ name: 'Không có gì đang phát ấy ? thử lại ikkk.... ❌' })
               if (!queue || !queue.isPlaying()) return await message.reply({ embeds: [noMusic] });

               queue.delete();
               const stopEmbed = new EmbedBuilder()
                    .setColor('#b72563')
                    .setAuthor({ name: 'Nhà ngươi đã cho ta ngừng hát 🤬', iconURL: message.author.displayAvatarURL() })


               await message.reply({ embeds: [stopEmbed] });

          } catch (error) {
               console.log("There was an error in forceskip: ", error);
          }
     }
} as const as PrefixCommands;