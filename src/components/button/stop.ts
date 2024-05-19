import { MusicButtonComponent } from "../../component";

const { EmbedBuilder } = require('discord.js');

export = {
     name: "stop",
     type: 'music',
     callback: async (client, interaction, customId, queue) => {

          const noMusic = new EmbedBuilder()
               .setAuthor({ name: 'Không có gì đang phát ấy ? thử lại ikkk.... ❌' })

          if (!queue || !queue.isPlaying()) return await interaction.editReply({ embeds: [noMusic] });

          queue.delete();

          const stopEmbed = new EmbedBuilder()
               .setColor('#b72563')
               .setAuthor({ name: 'Nhà ngươi đã cho ta ngừng hát 🤬', iconURL: interaction.user.avatarURL() })

          await interaction.editReply({ embeds: [stopEmbed] });

     },
} as const as MusicButtonComponent