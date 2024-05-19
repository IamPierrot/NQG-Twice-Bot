
import { EmbedBuilder } from 'discord.js';

export = (queue: any) => {

     const Disconnect = new EmbedBuilder()
          .setAuthor({ name: `Ngắt kết nối với kênh voice! ❌` })
          .setColor('#2f3136')
          .setDescription("Mình không còn giá trị gì hay sao :face_holding_back_tears: ");

     queue.metadata.send({ embeds: [Disconnect] });
}