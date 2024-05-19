import prefixModel from '../../database/models/prefixModel';
import { PrefixCommands } from '../../cmds';

export = {
     name: "changeprefix",
     aliases: ["cp"],
     description: 'thay đổi prefix cho máy chủ hiện tại',
     adminOnly: true,

     callback: async (client, message, args) => {
          const data = await prefixModel.findOne({ guildId: message.guildId });
          const newPrefix = args[0];
          if (data) {
               data.prefix = newPrefix;
          } else {
               await new prefixModel({ prefix: newPrefix, guildId: message.guildId }).save();
               return await message.reply(`Đã tạo mới prefix cho máy chủ hiện tại  \`${newPrefix}\``);
          }

          await data.save();
          const oldPrefix = data.prefix;

          await message.reply(`Đã thay đổi prefix cho máy chủ hiện tại từ \`${oldPrefix}\` thành \`${newPrefix}\``);

     }
} as const as PrefixCommands;