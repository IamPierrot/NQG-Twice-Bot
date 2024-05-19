import { MusicButtonComponent } from "../../component";

import { Client } from 'genius-lyrics';
import { EmbedBuilder } from 'discord.js';

export = {
     name: "lyrics",
     type: 'music',
     callback: async (client, interaction, customId, queue) => {
          const genius = new Client();

          const noMusic = new EmbedBuilder()
               .setAuthor({ name: 'Không có gì đang phát ấy ? thử lại ikkk.... ❌' })
          if (!queue || !queue.isPlaying()) await interaction.editReply({ embeds: [noMusic] });

          try {
               const search = await genius.songs.search(queue.currentTrack?.title!);

               const song = search.find(song => song.artist.name.toLowerCase() === queue.currentTrack?.author.toLowerCase());

               if (!song) return await interaction.editReply({ content: `Không tìm thấy lyrics của ${queue.currentTrack?.title}... ` });
               const lyrics = await song.lyrics();
               const embeds = [];
               for (let i = 0; i < lyrics.length; i += 4096) {
                    const toSend = lyrics.substring(i, Math.min(lyrics.length, i + 4096));
                    embeds.push(new EmbedBuilder()
                         .setTitle(`Lời nhạc của ${queue.currentTrack?.title}`)
                         .setDescription(toSend)
                         .setColor('#2f3136')
                         .setTimestamp()
                         .setFooter({ text: 'Am nhac di truoc - Tinh yeu theo sau ❤️', iconURL: interaction.user.avatarURL()! })
                    );
               }
               await interaction.editReply({ embeds: embeds });
          } catch (error) {
               console.log(`There was an error in lyrics`, error);
               await interaction.editReply({ embeds: [new EmbedBuilder().setAuthor({ name: ` ❌ Có lỗi khi tìm lyrics ` })] });
          }
     }
} as const as MusicButtonComponent
