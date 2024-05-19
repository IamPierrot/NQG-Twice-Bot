import { SlashCommands } from "../../cmds";

export = {
     name: "setuptempvoice",
     description: "first setting to create temp voice",
     options: [],
     deleted: true,
     callback: async (client, interaction) => {
          try {
               await interaction.guild?.channels.create({
                    name: "",

               })


          } catch {

          }


     },
} as const as SlashCommands;