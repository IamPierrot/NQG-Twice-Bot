import { EmbedBuilder } from "discord.js";
import { PrefixCommands } from "../../cmds";
import { getShardInfo } from "../../utils/shardInfo";

export = {
    name: "shard",
    description: "xem thông tin về shard đang hoạt động",
    aliases: [""],

    callback: async (client, message, args) => {
        if (!client.shard) return message.reply({
            embeds: [
                new EmbedBuilder().setTitle("Bot không có dùng shard").setColor("Red")
            ]
        });
        const table = await getShardInfo(client);
        await message.reply(`\`\`\`elm\n${table}\`\`\``);

    },
} as const as PrefixCommands;

