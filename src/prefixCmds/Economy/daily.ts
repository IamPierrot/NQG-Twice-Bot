import { duration } from "moment";
import { PrefixCommands } from "../../cmds";
import dailyModel from "../../database/models/dailyModel";
import { EmbedBuilder } from "@discordjs/builders";
import { giveRewardDaily } from "../../utils/rewarding";

export = {
     name: "daily",
     description: "nhận thưởng hằng ngày",
     aliases: ['d', 'qua'],
     callback: async (client, message, args) => {

          const dailyData = await dailyModel.findOne({ userId: message.author.id });
          if (!dailyData) return await message.reply("Không có dữ liệu!");
          const timeLaps = (dailyData.cooldowns + 86400000) - Date.now();

          const cooldownDailyUser = duration(timeLaps).format(" D [ngày], H [giờ], m [phút], s [giây]");
          if (timeLaps >= 0) return await message.reply(`Quà hằng ngày của bạn còn **${cooldownDailyUser}** mới được nhận tiếp`)

          dailyData.streaks++;
          dailyData.cooldowns = Date.now();

          await dailyData.save();
          const nextCooldowns = duration((dailyData.cooldowns + 86400000) - Date.now()).format(" D [ngày], H [giờ], m [phút], s [giây]");
          const reward = await giveRewardDaily(client, message.author.id, dailyData.streaks);

          const dailyEmbed = new EmbedBuilder()
               .setTitle("Bạn đã điểm danh hôm nay!")
               .setDescription(`
                    > **${message.author.globalName}**, Quà của bạn nè ${reward}
                    > **Thời gian nhận quà tiếp theo là**: ${nextCooldowns}
               `)
               .setFooter({ text: "Hãy cố gắng lên nào!" });

          await message.reply({ embeds: [dailyEmbed] });
     },
} as const as PrefixCommands;