import { PrefixCommands } from "../../cmds";

export = {
     name: 'give',
     description: "Chuyển tiền cho người khác!",
     tips: "+ @ten + số tiền",
     aliases: ['pay'],

     callback: async (client, message, args) => {
          const author = message.author.id;
          const toGiveUser = message.mentions.users.first();
          if (!toGiveUser) return await message.reply("Người bạn ping không tồn tại...");
          if (toGiveUser.id === author) return await message.reply("Bạn không thể chuyển tiền cho chính mình!");

          const soTien = parseInt(args[1]);
          if (isNaN(soTien)) return await message.reply("Bạn nhập số gì vậy?")
          const bal = await client.xemTien(author);
          const toBal = await client.xemTien(toGiveUser.id);
          if (!toBal) return message.reply(`${toGiveUser.toString()} chưa tạo tài khoản chưa thể chuyển tiền!`);
          if (!bal) return message.reply("Bạn chưa tạo tài khoản chưa thể chuyển tiền!")
          if (soTien < 0) return message.reply("Bạn không thể nhập số tiền âm");
          if (soTien > bal) return message.reply("Nghèo còn bày đặt đi cho tiền người khác");
          
          await client.truTien(author, soTien);
          await client.addTien(toGiveUser.id, soTien);
          await message.reply(`<a:verified_tick:1130871737580531792> | Đã chuyển cho ${toGiveUser} \`${soTien.toLocaleString('en-ES')}\` ${client.customEmoji.coin} **Vcoins** `);
     }
} as const as PrefixCommands;