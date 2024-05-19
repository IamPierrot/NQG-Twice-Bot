import { AttachmentBuilder, EmbedBuilder } from "discord.js";
import { PrefixCommands } from "../../cmds";
import inventoryModel from "../../database/models/inventoryModel";
import path from "path";

export = {
     name: "inventory",
     description: "xem kho vật phẩm",
     aliases: [""],

     callback: async (client, message, args) => {
          return message.reply("Tính năng đang trong quá trình phát triển!");
          const userInventory = await inventoryModel.findOne({ userId: message.author.id });
          const nameOfItems = {
               101: "Bánh Chưng",
               102: "Cá Chép",
               103: "Đầu Lân",
               104: "Dưa Hấu",
               105: "Hoa Mai",
               106: "Lì Xì"
          }

          const itemsKeys = Object.keys(client.itemEmoji);
          const description = itemsKeys.map((value) => {
               return `> \`${value}\` **:** **${nameOfItems[value as keyof object]}** - \`${userInventory?.items?.[value as keyof object]}\` `
          }).join("\n")
          const file = new AttachmentBuilder(path.join(process.cwd(), 'assets', 'lunarnewyear.jpg'));

          const embed = new EmbedBuilder()
               .setAuthor({ name: "Kho Vật Phẩm", iconURL: message.author.avatarURL() || undefined })
               .setColor('LightGrey')
               .setTitle(`Kho vật phẩm của ${message.author.displayName}`)
               .setDescription(description)
               .setImage('attachment://lunarnewyear.jpg')
               .setTimestamp()

          await message.reply({ embeds: [embed], files: [file] });
     },
} as const as PrefixCommands