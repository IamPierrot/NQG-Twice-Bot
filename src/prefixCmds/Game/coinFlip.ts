import { EmbedBuilder } from "discord.js";
import { PrefixCommands } from "../../cmds";

export = {
     name: 'coinflip',
     description: "chơi game tung đồng xu",
     tips: "+ Số tiền (hoặc all) + t hoặc h (tùy chọn)",
     example: "coinflip 100 t",
     aliases: ['cf'],
     cooldowns: 5,

     callback: async (client, message, args) => {
          const author = message.author.id;
          const bal = await client.xemTien(author) as number;

          const moneyBet = await client.getMoneyBet(author, args);
          if (client.checkGameSyntax(moneyBet, bal)) return await message.reply({
               embeds: [
                    new EmbedBuilder().setTitle(`${moneyBet > bal ? "Nghèo mà sĩ" : "Bạn đã nhập sai cú pháp!"}`)
                         .setDescription(`
                              > VD: ${configure.app.prefix} 3000
                              > Chọn mức tiền để cược.
                              > Mức cược thấp nhất là \`3000\` ${client.customEmoji.coin} Vcoins.
                         `)
                         .setColor("Red")
               ]
          }).then((msg) => setTimeout(() => msg.delete(), 7000));

          const statusCoin = {
               't': 'sấp',
               'h': 'ngửa'
          }
          const choices = Object.keys(statusCoin);

          const choose = args[1] || choices[Math.floor(Math.random() * choices.length)]; // h hoăc t ;v

          const rand = Math.round(Math.random()) == 1 ? 't' : 'h';
          rand == choose ? await client.addTien(author, moneyBet) : await client.truTien(author, moneyBet);

          await message.reply(`<a:coin_flip:1163073855540187177> Bạn cược **${moneyBet.toLocaleString('en-ES')}** và chọn **${statusCoin[choose as keyof object]}**...`)
               .then(msg => {
                    setTimeout(() => {
                         msg.edit(`Đồng xu **mặt ${statusCoin[rand as keyof object]} và bạn ${rand == choose ? `thắng ${(moneyBet * 2).toLocaleString('en-ES')} ${client.customEmoji.coin} Vcoins` : 'mất hết rồi...'}** `);
                    }, 3000);
               })
     }
} as const as PrefixCommands;