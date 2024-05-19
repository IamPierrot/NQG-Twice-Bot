import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js";
import { PrefixCommands } from "../../cmds";
import userModel from "../../database/models/userModel";
import balanceModel from "../../database/models/balanceModel";
import chatLevelModel from "../../database/models/chatLvModel";
import voiceLevelModel from "../../database/models/voiceLvModel";
import dailyModel from "../../database/models/dailyModel";

export = {
     name: "register",
     description: "tạo thông tin người dùng",
     aliases: ["pf", "cprofile", "taoprofile", "rg"],

     callback: async (client, message, args) => {

          const userData = await userModel.findOne({ userId: message.author.id });
          const balanceData = await balanceModel.findOne({ userId: message.author.id });
          const chatLvData = await chatLevelModel.findOne({ userId: message.author.id });
          const voiceLvData = await voiceLevelModel.findOne({ userId: message.author.id });
          const dailyData = await dailyModel.findOne({ userId: message.author.id });

          if (userData
               || balanceData
               || chatLvData
               || voiceLvData
               || dailyData
               ) return await message.reply({ embeds: [new EmbedBuilder().setAuthor({ name: "Bạn đã tạo tài khoản rồi!" })] });

          const tosEmbed = new EmbedBuilder()
               .setColor("Red")
               .setTitle("**ĐIỀU KHOẢN SỬ DỤNG - BOT GAME VÀ HỆ THỐNG KINH TẾ**")
               .setDescription(`
          <a:NA_GeneralUpdates:1166628301817786408> Vui lòng đọc kỹ và hiểu rõ các điều khoản sau trước khi sử dụng bot của chúng tôi. Bằng cách sử dụng bot, bạn đồng ý tuân thủ tất cả các điều khoản dưới đây. Nếu bạn không đồng ý với bất kỳ điều khoản nào, vui lòng không sử dụng bot.<a:NA_GeneralUpdates:1166628301817786408>
    
                  **1. Gian lận và phần mềm thứ 3: **
    
                  1.1. Chúng tôi không chấp nhận người dùng sử dụng phần mềm thứ 3 dưới mọi hình thức.
    
                  1.2. Phát hiện và lợi dụng bug của bot cho mục đích cá nhân sẽ bị BAN thẳng tay. 
                  
                  **2. Sự thay đổi và cập nhật: **

                  2.1 Hãy theo dõi kênh <#1118050184312664094> thường xuyên để biết thêm những cập nhật mới về bot.
                  
                  **Liên hệ:**
                  
                  <a:Glitch_warn:1166628298374266971> Nếu bạn có bất kỳ thắc mắc hoặc báo lỗi nào, vui lòng liên hệ <@874321270437728257> hoặc <@942356413546635264>.
                `);
          const customId = "register";
          const tosBtn = new ButtonBuilder()
               .setCustomId(customId)
               .setLabel("Chấp nhận điều khoản")
               .setStyle(ButtonStyle.Primary)
               .setEmoji("👍")

          const row = new ActionRowBuilder<ButtonBuilder>().addComponents(tosBtn);


          const a = await message.reply({
               content: "**## Bằng cách sử dụng bot, bạn xác nhận đã đọc, hiểu và chấp nhận tất cả các điều khoản sử dụng. Nếu bạn không đồng ý với các điều khoản này, vui lòng không sử dụng bot.**",
               embeds: [tosEmbed],
               components: [row],
          })

          client.userComponent.set(message.author.id, { custom_id: customId, msg: a });
          setTimeout(() => {
               a.delete().catch(() => function () { });
               client.userComponent.delete(message.author.id);
          }, 60000)
     }
} as const as PrefixCommands;