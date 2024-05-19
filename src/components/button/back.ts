import { MusicButtonComponent } from "../../component";

export = {
     name: 'back',
     type: 'music',
     callback: async (client, interaction, customId, queue) => {
          if (!queue || !queue.node.isPlaying()) await interaction.editReply({content: "Không có bài nhạc nào đang phát...."});
          if (!queue.history.previousTrack) return interaction.editReply({ content: ` Không có bài nhạc nào đã phát trước đó? ❌` });
     
          await queue.history.back();
     
          interaction.editReply({content: `<@${interaction.user.id}> thành công hát lại bài trước đó ✅`})
          // .then((msg) => setTimeout(() => msg.delete(), 5000)); 
     }
} as const as MusicButtonComponent