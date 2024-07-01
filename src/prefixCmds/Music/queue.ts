import { useQueue } from "discord-player";
import { PrefixCommands } from "../../cmds";
import { EmbedBuilder } from "discord.js";

export = {
    name: "queue",
    description: "xem hàng chờ",
    aliases: ["q"],
    voiceChannel: true,
    callback: async (client, message, args) => {
        const queue = useQueue(message.guild!);
        if (!queue || !queue.isPlaying()) return message.reply({ content: `Mình đang không hát bài nào mà? ❌` });

        const methods = ['', '🔁', '🔂'];

        const songs = queue.tracks.toArray().length;

        const nextSongs = songs > 5 ? `Và **${songs - 5}** bài khác nữa...` : `Đang trong hàng chờ được phát là **${songs}** bài hát...`;

        const tracks = queue.tracks.map((track, i) => `**${i + 1}** - \`${track.title} | ${track.author}\` (Yêu cầu bởi : ${track.requestedBy?.toString()})`)

        const embed = new EmbedBuilder()
            .setColor('#2f3136')
            .setThumbnail(message.guild?.iconURL({ size: 2048 })!)
            .setAuthor({ name: `Danh sách hàng chờ - ${message.guild?.name}`, iconURL: client.user?.displayAvatarURL({ size: 1024 }) })
            .setDescription(`**Đang phát:** ${queue.currentTrack?.toHyperlink()} ${methods[queue.repeatMode]}\n\n${tracks.slice(0, 5).join('\n')}\n\n${nextSongs}`)
            .setTimestamp()
            .setFooter({ text: 'Âm nhạc đi trước - Tình yêu theo sau ❤', iconURL: message.author.avatarURL()! })

        await message.reply({ embeds: [embed] });
    }
} as const as PrefixCommands;