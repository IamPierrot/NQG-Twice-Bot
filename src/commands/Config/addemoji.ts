import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { default as axios } from 'axios';
import { SlashCommands } from "../../cmds";
export = {
     name: "addemoji",
     description: "add an emoji to your channel!",
     adminOnly: true,
     options: [
          {
               name: "emoji",
               description: "The emoji you want to add, can be url/emoji",
               required: true,
               type: ApplicationCommandOptionType.String,
               autocomplete: true
          },
          {
               name: "name",
               description: "The name of the emoji",
               required: true,
               type: ApplicationCommandOptionType.String
          }
     ],

     callback: async (client, interaction) => {
          /* Check for permissions */
          // if (!interaction.member?.permissions.has("MANAGE_EMOJIS_AND_STICKERS"))
          //      return interaction.followUp({ content: "You do not have enough permissions to use this command." })

          /* Get options and save it to varibale for later use */
          let emoji = interaction.options.getString('emoji')?.trim()
          const name = interaction.options.getString('name')

          if (!emoji || !name) return await interaction.editReply("bạn chưa điền tên emoji và emoji!");
          /* If "emoji" as variable starts with "<" and ends with ">" */
          if (emoji.startsWith("<") && emoji.endsWith(">")) {
               /* Extract ID using basic regex */
               const id = emoji.match(/\d{15,}/g)?.[0] // "\d" -> takes digit, "{15, }" makes sure to get digit with more than 15 numbers 

               /* Send request to emoji url with gif as extension to check if emoji is gif or not */
               const type = await axios.get(`https://cdn.discordapp.com/emojis/${id}.gif`)
                    .then(image => {
                         if (image) return "gif"
                         else return "png"
                    }).catch(err => {
                         return "png"
                    })

               emoji = `https://cdn.discordapp.com/emojis/${id}.${type}?quality=lossless`
          }
          /* Create emoji and send embed, if error catch it and send error message */
          await interaction.guild?.emojis.create({ name: name, attachment: emoji })
               .then(emoji => {
                    const embed = new EmbedBuilder()
                         .setTitle("Emoji Added ✅")
                         .setDescription(`Added new emoji [ ${emoji.toString()} ] with name **\`[ ${emoji.name} ]\`**`)
                         .setColor("Green")

                    return interaction.followUp({ embeds: [embed] })
               }).catch(err => {
                    return interaction.followUp(`😅 | Unable to add emoji. \n \`\`\`\n ${err.rawError.message}\`\`\``);
               })
     }
} as const as SlashCommands;
