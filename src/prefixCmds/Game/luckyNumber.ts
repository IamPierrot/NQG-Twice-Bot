import { EmbedBuilder } from "discord.js";
import { PrefixCommands } from "../../cmds";
export = {
     name: "luckynumber",
     description: "chọn con số may mắn (đánh đề)",
     aliases: ["danh", "laychoemcon", "danhchoemcon"],
     tips: "+ số + số tiền",
     cooldowns: 5,

     callback: async (client, message, args) => {
          const [choiceNumber, moneyBet] = [args[0], parseInt(args[1])];
          const bal = await client.xemTien(message.author.id)

          const checkSyntax = (): boolean => {
               return !choiceNumber
                    || !moneyBet
                    || isNaN(moneyBet)
                    || isNaN(parseInt(choiceNumber))
                    || choiceNumber?.length < 2
                    || moneyBet < 3000
                    || moneyBet > bal
          }
          if (checkSyntax()) return await message.reply({
               embeds: [
                    new EmbedBuilder().setTitle(`${moneyBet > bal ? "Nghèo mà sĩ" : "Bạn đã nhập sai cú pháp!"}`)
                         .setDescription(`
                              > VD: ${configure.app.prefix} 69 3000
                              > Chọn tối đa 1 số mà tối thiểu số đó gồm 2 chữ số.
                              > Mức cược thấp nhất là \`3000\` ${client.customEmoji.coin} Vcoins.
                         `)
                         .setColor("Red")
               ]
          }).then(() => setTimeout(() => message.delete(), 7000));

          await client.truTien(message.author.id, moneyBet);

          const randNumber = Math.floor(Math.random() * 90) + 10;

          const resultEmbed = new EmbedBuilder()
               .setTitle(`Số trúng thưởng hôm nay là: ${randNumber}`)
               .setFooter({ text: "Đánh càng mạnh tiền càng nhiều!", iconURL: client.user?.avatarURL()! });

          if (randNumber == parseInt(choiceNumber)) {
               const reward = moneyBet * 4 + Math.floor(Math.random() * (moneyBet));
               await client.addTien(message.author.id, reward);
               resultEmbed.setDescription(`
               > **Chúc mừng bạn đã đoán trúng!**
               > **Giải thưởng của bạn là ${reward} ${client.customEmoji.coin} Vcoins**
               `).setColor("Gold")
          } else {
               resultEmbed.setDescription(`
               > **Ôi không bạn đã đoán sai rồi**
               > **Giải thưởng của bạn là 1 cái sổ đỏ mất tích.**
          `).setColor("Red")
          }


          await message.reply({ embeds: [resultEmbed] });


     }

} as const as PrefixCommands