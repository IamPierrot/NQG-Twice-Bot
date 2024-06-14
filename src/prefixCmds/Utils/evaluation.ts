import { PrefixCommands } from "../../cmds";

export = {
    name: 'evaluate',
    description: "thực hiện 1 đoạn chương trình javaScript",
    aliases: ['e', 'eval'],

    callback: async (client, message, args) => {
        return await message.reply("Tính năng đang trong quá trình phát triển!");
        // try {
        //     const codePattern = /([^`]+)/g;
        //     const codeString = args.join('').match(codePattern);
        //     if (!codeString) throw new Error();
        //     console.log(codeString);
        //     const result = eval(args.join('').startsWith('`') ? codeString[0].match(/([^\n])/g)?.[0]! : args.join(''));
        //     await message.reply({ embeds: [new EmbedBuilder().setTitle(`Kết quả phép tính là | **\`${result.toLocaleString('en-US')}\`**`)] });

        // } catch (error) {
        //     message.reply("Biểu thức bạn nhập không có ý nghĩa").then((msg) => setTimeout(() => msg.delete(), 10000));
        // }

    }
} as const as PrefixCommands;