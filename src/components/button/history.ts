import { EmbedBuilder } from 'discord.js';
import { MusicButtonComponent } from '../../component';
export = {
     name: 'history',
     type: 'music',
     callback: async (client, interaction, customId, queue) => {
          if (!queue || queue.history.tracks.toArray().length == 0) return interaction.editReply({ content: `Không có bài nhạc nào đã phát trước đây....` });

          const tracks = queue.history.tracks.toArray();

          if (queue.history.size > 10) queue.history.clear();

          const description = tracks
               .slice(0, 20)
               .map((track, index) => { return `**${index + 1}.** [${track.title}](${track.url}) ` })
               .join('\r\n\r\n');

          const HistoryEmbed = new EmbedBuilder()
               .setAuthor({ name: `LỊCH SỬ BÀI HÁT`, iconURL: interaction.user.avatarURL()! })
               .setDescription(description)
               .setColor('#2f3136')
               .setTimestamp()
               .setFooter({ text: 'Âm nhạc đi trước - Tình yêu theo sau ❤️', iconURL: interaction.user.avatarURL()! })


          await interaction.editReply({ embeds: [HistoryEmbed] });

     },
} as const as MusicButtonComponent