import { EmbedBuilder, version } from "discord.js";
import { duration } from "moment";
import "moment-duration-format";
import os from "os";
import { PrefixCommands } from "../../cmds";
const cpuStat = require('cpu-stat')

export = {
     name: "stats",
     aliases: ['info', 'bot'],
     description: "Xem thông tin của bot",

     callback: async (client, message, args) => {
          cpuStat.usagePercent(async function (err: any, percent: any) {
               if (err) {
                    return console.log(err);
               }
               const cpuUsage = percent.toFixed(2);

               const durationBot = duration(client.uptime).format(" D [ngày], H [giờ], m [phút], s [giây]");
               const botStatsEmbed = new EmbedBuilder()
                    .setTitle(`Thông Tin Về ${client.user!.username}`)
                    .setColor("Random")
                    .addFields(
                         {
                              name: `<a:9182galaxystar2:1131116746917556256> THÔNG TIN CỦA BOT \n > <a:NQG_muiten6:1129818502044323841> Prefix: \`${client.prefix}\``,
                              value: ' > **<a:NQG_muiten6:1129818502044323841> Owner:** `Cá và Hàu`', inline: false
                         },
                         {
                              name: `> <a:NQG_muiten6:1129818502044323841> Số lượng máy chủ: \`${await client.getTotalGuild()}\``,
                              value: `> **<a:NQG_muiten6:1129818502044323841> Số lượng kênh**: \`${client.channels.cache.size}\``, inline: false
                         },
                         {
                              name: '> <a:NQG_muiten6:1129818502044323841> Categories:`5`',
                              value: `> **<a:NQG_muiten6:1129818502044323841> Số lượng lệnh:** \`${client.slashCommands.length}\``, inline: false
                         },
                         {
                              name: `<a:8785galaxystar:1131116698192318495> CHỈ SỐ CỦA BOT \n > <a:NQG_muiten5:1129818541042966529> Sử dụng CPU: \`${cpuUsage}%\``,
                              value: `> <a:NQG_muiten5:1129818541042966529> **Sử dụng Ram:** \`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2).toLocaleUpperCase('en-ES')} / ${(os.totalmem() / 1024 / 1024).toFixed(2).toLocaleUpperCase('en-ES')} MB\``, inline: false
                         },
                         {
                              name: `> <a:NQG_muiten5:1129818541042966529> Hệ thống: \`${os.arch()}\``,
                              value: `> **<a:NQG_muiten5:1129818541042966529> Nền tảng:** \`${os.platform()}\``, inline: false
                         },
                         {
                              name: `> <a:NQG_muiten5:1129818541042966529> Thư viện: \`Discord.js\``,
                              value: `> **<a:NQG_muiten5:1129818541042966529> Phiên bản thư viện:** \`v${version}\``, inline: false
                         },
                         {
                              name: `> <a:NQG_muiten5:1129818541042966529> Phiên bản node: \`${process.version}\``,
                              value: `> **<a:NQG_muiten5:1129818541042966529> Thời gian hoạt động:** \`${durationBot}\``, inline: false
                         },
                    )
                    .addFields([
                         {
                              name: "<a:NQG_pinkmail:1131118262822907925> Bot đang trong quá trình phát triển!",
                              value: "Tôi ăn cắp code của bot NeyuQ Gang"
                         }
                    ])
                    .setThumbnail(`${client.user!.avatarURL()}`)
               message.channel.send({ embeds: [botStatsEmbed] });
          });
     },
} as const as PrefixCommands;
