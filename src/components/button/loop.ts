import { MusicButtonComponent } from "../../component";

import { QueueRepeatMode } from 'discord-player';
import { EmbedBuilder } from 'discord.js';

export = {
     name: "loop",
     type: 'music',
     callback: async (client, interaction, customId, queue) => {
          const methods = ['Lặp bài hát', 'Lặp cả hàng chờ', 'tắt vòng lặp'];
          const noMusic = new EmbedBuilder()
               .setAuthor({ name: 'Không có gì đang phát ấy ? thử lại ikkk.... ❌' })

          if (!queue || !queue.isPlaying()) {
               await interaction.editReply({ embeds: [noMusic] });
          } else {

               const repeatMode = queue.repeatMode;
               switch (repeatMode) {
                    case 0:
                         queue.setRepeatMode(QueueRepeatMode.TRACK)
                         break;
                    case 1:
                         queue.setRepeatMode(QueueRepeatMode.QUEUE)
                         break;
                    case 2:
                         queue.setRepeatMode(QueueRepeatMode.OFF)
                         break;
                    default:
                         break;
               }

               const loopEmbed = new EmbedBuilder()
                    .setTitle(`Thiết lập chế độ : **${methods[repeatMode]}** ✅`)

               await interaction.editReply({ embeds: [loopEmbed] });
          }

     }
} as const as MusicButtonComponent