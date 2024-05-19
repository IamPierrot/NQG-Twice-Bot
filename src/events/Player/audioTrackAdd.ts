import { Track } from "discord-player";

import { EmbedBuilder } from 'discord.js';

export = (queue: any , track: Track) => {
     if (!configure.app.ExtraMessages) return

     const audioTrackAdd = new EmbedBuilder()
          .setAuthor({ name: `Track ${track.title} added in the queue ✅`, iconURL: track.thumbnail })
          .setColor('#2f3136')

     queue.metadata.send({ embeds: [audioTrackAdd] })
}    