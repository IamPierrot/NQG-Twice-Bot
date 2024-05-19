import { ActivityOptions, ActivityType, EmbedBuilder, TextChannel } from "discord.js";
import { LoliBotClient } from "../../utils/clients";
import xoSoUserModel from "../../database/models/xoSoUserModel";
import xoSoModel from "../../database/models/xoSoModel";
import chalk from "chalk";

const status : ActivityOptions[] = [
     {
          name: 'Youtube 🎧',
          type: ActivityType.Streaming,
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
     },
     {
          name: 'Spotify 🎧',
          type: ActivityType.Streaming,
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
     },
     {
          name: 'soundCloud 🎧',
          type: ActivityType.Streaming,
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
     },
]

export = async (client: LoliBotClient) => {
     
     if (!client.user) throw new Error('Cook');
     
     setInterval(() => {
          const random = Math.floor(Math.random() * status.length);
          client.user!.setActivity(status[random]);
     }, 10000)
     
     console.log(chalk.green.bold(`✅ Sucessfully logged into ${chalk.bold.magenta(client.user.tag)}`));
     setInterval(() => {
          generateLottery();
     }, 60 * 15 * 1000); // cho 10 phút xổ số 1 lần

     const generateLottery = async () => {

          try {
               class xoSoKienThiet {
                    soGiaiTrungTatca: number;
                    cacSoTrungThuong: number[];

                    constructor(cacSoTrungThuong: number[] = [], soGiaiTrungTatca = 0) {
                         this.cacSoTrungThuong = cacSoTrungThuong;
                         this.soGiaiTrungTatca = soGiaiTrungTatca;
                    }
                    setCacSoTrungThuong(...args: number[]) {
                         args.forEach((element) => this.cacSoTrungThuong.push(element))

                    }
                    getCacSoTrungThuong() {
                         return this.cacSoTrungThuong.map((num, index) => `> **${index == 0 ? `Giải Đặc Biệt` : index == 1 ? `Giải Nhất` : index == 2 ? 'Giải Nhì' : index == 3 ? 'Giải Ba' : 'Giải Khuyến khích'} :** \`${num}\``)
                              .join('\n');
                    }
                    getSoGiaiTrungTatca() {
                         return `\`\`\`css\n Có tất cả là ${this.soGiaiTrungTatca} giải trúng\`\`\``;
                    }
               }
               const xoSoObject = new xoSoKienThiet();

               const giaiDB = Math.floor(Math.random() * (1e6 - 1e5)) + 1e5;
               const giaiNhat = Math.floor(Math.random() * (1e5 - 1e4) + 1e4);
               const giaiNhi = Math.floor(Math.random() * (1e4 - 1e3) + 1e3);
               const giaiBa = Math.floor(Math.random() * (1e3 - 1e2) + 1e2);
               const giaiKK = Math.floor(Math.random() * (1e2 - 1e1) + 1e1);

               xoSoObject.setCacSoTrungThuong(giaiDB, giaiNhat, giaiNhi, giaiBa, giaiKK);

               const xoSoData = await xoSoModel.findOne();
               const channel = client.guilds.cache.get("1070274984116768879")?.channels.cache.get("1232689784539975740") as TextChannel | undefined;

               if (!channel) console.log("Có lỗi tìm channel trong ready");
               if (xoSoData) {
                    xoSoData.giaiDB = String(giaiDB);
                    xoSoData.giaiNhat = String(giaiNhat);
                    xoSoData.giaiNhi = String(giaiNhi);
                    xoSoData.giaiBa = String(giaiBa);
                    xoSoData.giaiKK = String(giaiKK);
                    await xoSoData.save();


                    const UserIdArray = xoSoData.userId;
                    for (const userId of UserIdArray) {
                         const userData = await xoSoUserModel.findOne({ userId: userId });
                         if (!userData) continue;
                         const xosoArray = userData.soLuong;

                         const [trungGiaiDb, trungGiaiNhat, trungGiaiNhi, trungGiaiBa, trungGiaiKK] = [
                              xosoArray.filter(value => value == xoSoData.giaiDB),
                              xosoArray.filter(value => value.slice(-5) == xoSoData.giaiNhat),
                              xosoArray.filter(value => value.slice(-4) == xoSoData.giaiNhi),
                              xosoArray.filter(value => value.slice(-3) == xoSoData.giaiBa),
                              xosoArray.filter(value => value.slice(-2) == xoSoData.giaiKK)
                         ];

                         if (trungGiaiDb.length > 0) {
                              await channel?.send(`Chúc mừng <@${userId}> đã trúng \`${trungGiaiDb.length}\` **giải đặc biệt**`);
                              await client.addTien(userId, 4e6);
                         }
                         if (trungGiaiNhat.length > 0) {
                              await channel?.send(`Chúc mừng <@${userId}> đã trúng \`${trungGiaiNhat.length}\` **giải nhất**`)
                              await client.addTien(userId, 1e6);
                         }
                         if (trungGiaiNhi.length > 0) {
                              await channel?.send(`Chúc mừng <@${userId}> đã trúng \`${trungGiaiNhi.length}\` **giải Nhì**`)
                              await client.addTien(userId, 8e5);
                         }
                         if (trungGiaiBa.length > 0) {
                              await channel?.send(`Chúc mừng <@${userId}> đã trúng \`${trungGiaiBa.length}\` **giải Ba**`)
                              await client.addTien(userId, 5e5);
                         }
                         if (trungGiaiKK.length > 0) {
                              await channel?.send(`Chúc mừng <@${userId}> đã trúng \`${trungGiaiKK.length}\` **giải khuyến khích**`)
                              await client.addTien(userId, 1e5);
                         }
                         xoSoObject.soGiaiTrungTatca += trungGiaiDb.length + trungGiaiNhat.length + trungGiaiBa.length + trungGiaiKK.length;
                         await userData.deleteOne();
                    }
                    await xoSoData.deleteOne();
               }

               const cacSoTrungThuongEmbed = new EmbedBuilder()
                    .setTitle('CÁC SỐ TRÚNG THƯỞNG')
                    .setDescription(`${xoSoObject.getCacSoTrungThuong()} \n ${xoSoObject.getSoGiaiTrungTatca()}`)
                    .setColor('Gold')
                    .setTimestamp()
               await channel?.send({ embeds: [cacSoTrungThuongEmbed] }).then((msg) => setTimeout(() => msg.delete(), 60 * 15 * 1000));
               
               
          } catch (error) {
               console.log("There was an error in lotteryGenerator: ", error);
          }
     }

}