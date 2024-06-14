import { EmbedBuilder } from "discord.js";
import { PrefixCommands } from "../../cmds";

export = {
    name: 'math',
    description: "tính toán các biểu thức đơn giản",
    aliases: ['m'],

    callback: async (client, message, args) => {
        try {
            const result = eval(args.join(''));
            if (isNaN(result)) throw new Error();
            await message.reply({ embeds: [new EmbedBuilder().setTitle(`Kết quả phép tính là | **\`${result.toLocaleString('en-US')}\`**`)] });
            
        } catch (error) {
            message.reply("Biểu thức bạn nhập không có ý nghĩa").then((msg) => setTimeout(() => msg.delete(), 10000));
        }

    }
} as const as PrefixCommands;