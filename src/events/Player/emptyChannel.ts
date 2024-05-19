
import { EmbedBuilder } from 'discord.js';

export = (queue: any) => {

     const emptyChannel = new EmbedBuilder()
          .setAuthor({ name: `Mọi Người bỏ tôi lại 1 mình 🥺` })
          .setColor('#2f3136')
          .setDescription(`Các anh thật ngu ngốc :sob:`)

     queue.metadata.send({ embeds: [emptyChannel] }).then(() => { try { queue.delete() } catch { } });
}