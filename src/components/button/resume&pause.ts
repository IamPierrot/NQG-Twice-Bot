import { MusicButtonComponent } from "../../component";

const { EmbedBuilder } = require('discord.js');

export = {
     name: "resume&pause",
     type: 'music',
     callback: async (client, interaction, customId, queue) => {
          const noMusic = new EmbedBuilder()
               .setAuthor({ name: 'Không có gì đang phát ấy ? thử lại ikkk.... ❌' })
          if (!queue || !queue.isPlaying()) return await interaction.editReply({ embeds: [noMusic] });

          const resumed = queue.node.resume();
          let message = `Tiếp tục hát bài nhạc ${queue.currentTrack?.title} ✅`;

          if (!resumed) {
               queue.node.pause();
               message = `Tạm dừng hát bài nhạc ${queue.currentTrack?.title} ❌`
          }

          await interaction.editReply({ content: message });
     },
} as const as MusicButtonComponent