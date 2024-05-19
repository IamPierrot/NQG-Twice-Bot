import { EmbedBuilder } from 'discord.js';

export = (queue: any, error: any) => {

    const ErrorEmbed = new EmbedBuilder()
        .setAuthor({ name: `Bot had an unexpected error, please check the console imminently!` })
        .setColor('#EE4B2B')
        .setTimestamp()

    queue.metadata.send({ embeds: [ErrorEmbed] , ephemeral: true}).then((msg: any) => msg.delete());

    console.log(`Error emitted from the Bot ${error.message}`);
}