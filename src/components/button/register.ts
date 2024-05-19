import { ButtonStandardComponent } from "../../component";

import userModel from "../../database/models/userModel";
import balanceModel from "../../database/models/balanceModel";
import chatLevelModel from "../../database/models/chatLvModel";
import voiceLevelModel from "../../database/models/voiceLvModel";
import { EmbedBuilder } from "discord.js";
import dailyModel from "../../database/models/dailyModel";
import inventoryModel from "../../database/models/inventoryModel";

export = {
     name: "register",
     type: 'standard',
     callback: async (client, interaction, customId, message) => {
          await message?.delete();

          await Promise.all([
               await new userModel({ userId: interaction.user.id }).save(),
               await new balanceModel({ userId: interaction.user.id, money: 10000 }).save(),
               await new chatLevelModel({ userId: interaction.user.id }).save(),
               await new voiceLevelModel({ userId: interaction.user.id }).save(),
               await new dailyModel({ userId: interaction.user.id }).save(),
               await new inventoryModel({ userId: interaction.user.id }).save()
          ]).catch((err) => console.log("There was an error when trying create Document for users:",err))


          const congratulateEmbeds = new EmbedBuilder()
               .setAuthor({ name: "Chào mừng bạn đã đến với xứ sở LOLI", iconURL: interaction.user.displayAvatarURL() })
               .setColor('LuminousVividPink')
               .setTitle("Cảm ơn bạn đã chấp nhận các điều khoản của Bot <3")
               .setDescription(`
                    Ϛ Tặng bạn **10k** ${client.customEmoji.coin} Vcoins
                    Ϛ **Chúc bạn vui vẻ khi sử dụng Bot** 💖
               `)
               .setFooter({ text: "Tình yêu đi trước, Âm nhạc theo sau 💖", iconURL: client.user?.displayAvatarURL() });

          client.userComponent.delete(interaction.user.id);
          return await interaction.editReply({ embeds: [congratulateEmbeds] });

     },
} as const as ButtonStandardComponent