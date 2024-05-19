import { LoliBotClient } from "./clients";

export const getApplicationCommands = async (client: LoliBotClient, guildId: string) => {
     let applicationCommands;

     if (guildId !== '') {
          const guild = await client.guilds.fetch(guildId);
          applicationCommands = guild.commands;
     } else if (configure.app.global) {
          applicationCommands =  client.application!.commands;
     }

     await applicationCommands?.fetch({});
     return applicationCommands;
};