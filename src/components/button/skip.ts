import { EmbedBuilder } from "discord.js";
import { QueueRepeatMode } from 'discord-player';
import { MusicButtonComponent } from "../../component";

export = {
     name: "skip",
     type: 'music',
     callback: async (client, interaction, customId, queue) => {
          const noMusic = new EmbedBuilder()
               .setAuthor({ name: 'Không có gì đang phát ấy ? thử lại ikkk.... ❌' })

          if (!queue || !queue.isPlaying()) return await interaction.editReply({ embeds: [noMusic] });

          queue.setRepeatMode(QueueRepeatMode.OFF);
          queue.node.skip();

          const skipEmbed = new EmbedBuilder()
               .setAuthor({ name: `⏭ Đã bỏ qua bài nhạc đang phát ${queue.currentTrack?.title} ` });

          await interaction.editReply({ embeds: [skipEmbed] });
     },
} as const as MusicButtonComponent