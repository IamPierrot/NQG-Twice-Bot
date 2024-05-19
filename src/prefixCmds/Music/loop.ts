import { EmbedBuilder } from "discord.js";
import { PrefixCommands } from "../../cmds";
import { QueueRepeatMode, useQueue } from "discord-player";

export = {
    name: "loop",
    description: "tuỳ chỉnh vòng lặp cho danh sách phát",
    aliases: ["l"],

    callback: async (client, message, args) => {
        const queue = useQueue(message.guild!);
        const methods = ['Lặp bài hát', 'Lặp cả hàng chờ', 'tắt vòng lặp'];
        const noMusic = new EmbedBuilder()
            .setAuthor({ name: 'Không có gì đang phát ấy ? thử lại ikkk.... ❌' })

        if (!queue || !queue.isPlaying()) {
            await message.reply({ embeds: [noMusic] });
        } else {
            const repeatMode = queue.repeatMode;
            switch (repeatMode) {
                case 0:
                    queue.setRepeatMode(QueueRepeatMode.TRACK)
                    break;
                case 1:
                    queue.setRepeatMode(QueueRepeatMode.QUEUE)
                    break;
                case 2:
                    queue.setRepeatMode(QueueRepeatMode.OFF)
                    break;
                default:
                    break;
            }

            const loopEmbed = new EmbedBuilder()
                .setDescription(`Thiết lập chế độ : **${methods[repeatMode]}** ✅`)

            await message.reply({ embeds: [loopEmbed] });
        }
    }
} as const as PrefixCommands;