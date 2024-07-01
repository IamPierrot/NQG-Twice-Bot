import { PrefixCommands } from "../../cmds";

import { useQueue } from 'discord-player';
import { EmbedBuilder } from 'discord.js';

export = {
     name: 'history',
     description: 'xem lại lịch sử phát',
     voiceChannel: true,

     callback: async (client, message) => {
          const queue = useQueue(message.guild!);

          if (!queue || queue.history.tracks.toArray().length == 0) return message.reply({ content: `Không có bài nhạc nào đã phát trước đây....` });

          const tracks = queue.history.tracks.toArray();

          if (queue.history.size > 10) queue.history.clear();

          const description = tracks
               .slice(0, 20)
               .map((track, index) => { return `**${index + 1}.** [${track.title}](${track.url}) ` })
               .join('\r\n\r\n');

          const HistoryEmbed = new EmbedBuilder()
               .setAuthor({ name: `LỊCH SỬ HÀNG CHỜ ĐÃ PHÁT`, iconURL: message.author.displayAvatarURL() })
               .setDescription(description)
               .setColor('#2f3136')
               .setTimestamp()
               .setFooter({ text: 'Âm nhạc đi trước - Tình yêu theo sau ❤️', iconURL: message.author.displayAvatarURL() })


          await message.reply({ embeds: [HistoryEmbed] });

     },
} as const as PrefixCommands