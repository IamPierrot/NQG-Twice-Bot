import { PrefixCommands } from "../../cmds";

import { EmbedBuilder } from "discord.js";
import xoSoUserModel from '../../database/models/xoSoUserModel';
import xoSoModel from '../../database/models/xoSoModel';

export = {
     name: "muaveso",
     aliases: ["mvs"],
     description: "Mua vé số",
   
     callback: async (client, message, args) => {
          const price = 10000;

          const amount = parseInt(args[0]) ? parseInt(args[0]) : 10;
          if (amount < 0) return message.reply('Rốt cuộc muốn mua nhiêu?')
          if (amount > 10) return message.reply('Bạn chỉ có thể mua tối đa 10 vé')

          let userData = await xoSoUserModel.findOne({
               userId: message.author.id
          })
          let data = await xoSoModel.findOne()
          if (!data) data = new xoSoModel({ userId: [] })

          data.userId.push(message.author.id)

          if (!userData) userData = new xoSoUserModel({ userId: message.author.id, soLuong: [] })

          const arr = userData.soLuong

          if (arr.length >= 10) return message.reply('Bạn đã sở hữu 10 vé số rồi!');

          if (await client.xemTien(message.author.id) < (price * amount)) return await message.reply("Không có tiền đòi chơi vé số!!!")
          await client.truTien(message.author.id, price * amount)

          for (let i = 0; i < amount; i++) {
               arr.push(String(Math.floor(Math.random() * (1e6 - 1e5)) + 1e5));
          }
          await userData.save();
          await data.save();

          const success = arr
               ? new EmbedBuilder().setDescription(
                    `**Bạn đã mua thành công ${amount} vé số với giá ${amount * price} <:Token:1181904336381562961> Vcoins**`
               ).setColor('Green')
               : new EmbedBuilder().setAuthor({ name: `Có lỗi khi mua hàng!` });
          await message.reply({ embeds: [success] });
     },
} as const as PrefixCommands;