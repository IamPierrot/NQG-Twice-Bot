import { MusicButtonComponent } from "../../component";

const { EmbedBuilder } = require('discord.js');

export = {
     name: "volumeup",
     type: 'music',
     callback: async (client, interaction, customId, queue) => {
          const noMusic = new EmbedBuilder()
               .setAuthor({ name: 'Không có gì đang phát ấy ? thử lại ikkk.... ❌' })
          if (!queue || !queue.isPlaying()) return await interaction.editReply({ embeds: [noMusic] });

          const maxVol = configure.opt.maxVol;
          const vol = Math.floor(queue.node.volume + 5)

          if (vol > maxVol) return interaction.editReply({ content: `Bạn không thể cho mình hát quá cao (○\｀ 3\′○)` })

          if (queue.node.volume === vol) return interaction.editReply({ content: `Mình đang hát ở tầng âm này mà ＞︿＜`, });

          const success = queue.node.setVolume(vol);

          return await interaction.editReply({ content: success ? `Mình đã chỉnh giọng hát lên ${vol}/${maxVol}% 🔊 roài đó :3` : `Something went wrong ${interaction.member}... try again ? ❌`, });

     },
} as const as MusicButtonComponent