import { EmbedBuilder } from "discord.js";
import { PrefixCommands } from "../../cmds";

export = {
     name: 'remove',
     description: "xoá vật phẩm của người dùng",
     adminOnly: true,
     tips: "@user <id của item> <số lượng>",

     callback: async (client, message, args) => {
          const toRemoveUser = message.mentions.members?.first() || message.guild?.members.cache.find((u) => u.id === args[0] || u.user.username === args[0]);
          const itemId = args[1];
          const amount = parseInt(args[2]);
          if (!toRemoveUser || isNaN(amount) || !itemId) return await message.reply({
               embeds: [
                    new EmbedBuilder().setTitle("Lỗi cú pháp!").setColor('Red')
                         .setDescription(`
                              > Cú pháp đúng: ${configure.app.prefix} remove @user <id của item> <số lượng>
                         `)
               ]
          });

          const result = await client.removeItem(toRemoveUser?.id, itemId, amount);
          result && await message.reply(`<a:verified_tick:1130871737580531792> | Đã loại bỏ thành công x${amount} ${client.itemEmoji[itemId as keyof object]} của ${toRemoveUser.toString()!}`);

     }
} as const as PrefixCommands;