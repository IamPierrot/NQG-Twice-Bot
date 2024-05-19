import { LoliBotClient } from "../../utils/clients";

import { areCommandsDifferent } from "../../utils/areCommandsDifferent";
import { getApplicationCommands } from '../../utils/getApplicationCommands.js';

export = async (client: LoliBotClient) => {
     try {
          const localCommands = client.slashCommands;
          const guildId = configure.app.guild;
          const applicationCommands = await getApplicationCommands(
               client,
               guildId
          );
          if (!applicationCommands) return;
          const listApllicationcommands = Array.from(applicationCommands?.cache).map(command => command[0]);
          const listExistingCommands = localCommands.map(command => command.name);

          for (const nameCommand of listApllicationcommands) {
               const command = applicationCommands?.cache.find(
                    (cmd) => cmd.name === nameCommand
               );
               if (!command) continue;
               if (!listExistingCommands.includes(nameCommand)) {
                    await applicationCommands.delete(command.id);
                    console.log(`🗑 Deleted command "${nameCommand}" cause it does not exist".`);
               }
          }

          for (const localCommand of localCommands) {
               const { name, description, options } = localCommand;

               const existingCommand =  applicationCommands.cache.find(
                    (cmd) => cmd.name === name
               );

               if (existingCommand) {
                    if (localCommand.deleted) {
                         await applicationCommands.delete(existingCommand.id);
                         console.log(`🗑 Deleted command "${name}".`);
                         continue;
                    }

                    if (areCommandsDifferent(existingCommand, localCommand)) {
                         await applicationCommands.edit(existingCommand.id, {
                              description,
                              options,
                         });

                         console.log(`🔁 Edited command "${name}".`);
                    }
               } else {
                    if (localCommand.deleted) {
                         console.log(
                              `⏩ Skipping registering command "${name}" as it's set to delete.`
                         );

                         continue;
                    }

                    await applicationCommands.create({
                         name,
                         description,
                         options,
                    });
                    console.log(`👍 Registered command "${name}."`);
               }
          }

     } catch (error) {
          console.log(`There was an error in register command: ${error}`);
     }
};