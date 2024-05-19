import { EmbedBuilder } from "discord.js";
import { PrefixCommands } from "../../cmds";

export = {
     name: 'add',
     description: "thêm vật phẩm của người dùng",
     adminOnly: true,
     tips: "@user <id của item> <số lượng>",

     callback: async (client, message, args) => {
          const toGiveUser = message.mentions.members?.first() || message.guild?.members.cache.find((u) => u.id === args[0] || u.user.username === args[0]);
          const itemId = args[1];
          const amount = parseInt(args[2]);
 

          if (!toGiveUser || isNaN(amount) || !itemId) return await message.reply({
               embeds: [
                    new EmbedBuilder().setTitle("Lỗi cú pháp!").setColor('Red')
                         .setDescription(`
                              > Cú pháp đúng: ${configure.app.prefix} add @user <id của item> <số lượng>
                         `)
               ]
               
          });
          
          const result = await client.addItem(toGiveUser?.id, itemId, amount);
          result ?
               await message.reply(`<a:verified_tick:1130871737580531792> | Đã thêm thành công ${amount.toLocaleString('en-ES')} ${itemId == "coin" ? client.customEmoji.coin : client.itemEmoji[itemId as keyof object]} cho ${toGiveUser.toString()!}`)
               :
               await message.reply("Không tìm thấy id vật phẩm!");



     }
} as const as PrefixCommands;