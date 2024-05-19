import { EmbedBuilder, GuildMember, TextChannel } from "discord.js";
import { LoliBotClient } from "../../utils/clients";

export = async (client: LoliBotClient, member: GuildMember) => {
     if (member.guild.id !== "1190668746365349888") return;

     const roleBot = member.guild.roles.cache.get("1190669310214033529")!;
     const roleMember = member.guild.roles.cache.get("1192684106903990342")!;
     const logChannel = client.guilds.cache.get("1190668746365349888")?.channels.cache.get("1192684445145256007") as TextChannel;

     const addRoleEmbed = new EmbedBuilder().setAuthor({ name: "Add role thành công!" }).setColor("Gold");
     if (member.user.bot) {

          if (!member.roles.cache.get(roleBot.id)) return;
          await member.roles.add(roleBot).then(() => {
               logChannel.send({
                    embeds: [
                         addRoleEmbed.setDescription(`${member.user.toString()} đã được add thành công role <@${roleBot}>`)
                    ]
               })
          }).catch(err => logChannel?.send({
               embeds: [
                    addRoleEmbed.setColor('Red').setAuthor({ name: "Có lỗi khi add role." }).setDescription(`\`\`\` \n ${err} \`\`\``)]
          }));
     } else {
          if (!member.roles.cache.get(roleMember.id)) return;
          await member.roles.add(roleMember).then(() => {
               logChannel?.send({
                    embeds: [
                         addRoleEmbed.setDescription(`${member.user.toString()} đã được add thành công role <@${roleBot}>`)
                    ]
               })
          }).catch(err => logChannel.send({
               embeds: [
                    addRoleEmbed.setColor('Red').setAuthor({ name: "Có lỗi khi add role." }).setDescription(`\`\`\` \n ${err} \`\`\``)]
          }));
     }


}