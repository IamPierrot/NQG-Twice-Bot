import { EmbedBuilder } from 'discord.js';

export = (queue: any, track: any) => {

     const playerSkip = new EmbedBuilder()
          .setAuthor({ name: "Thông báo", iconURL: track.thumbnail })
          .setTitle(`Bỏ qua **${track.title}**! ⏮️`)
          .setColor('#EE4B2B')

     queue.metadata!.send({ embeds: [playerSkip] })
}