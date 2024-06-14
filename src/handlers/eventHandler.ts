import path from "path";
import { LoliBotClient } from "../utils/clients";
import { dynamicImportModule, getAllFiles } from "../utils/functions";

export = async (client: LoliBotClient) => {
     try {
          const eventFolders: string[] = getAllFiles(path.join(__dirname, '..', 'events'), true);
          if (!eventFolders || eventFolders.length === 0) {
               throw new Error('No folders events have been found');
          }

          await Promise.all(eventFolders.map(async (eventFolder) => {
               const eventFiles = getAllFiles(eventFolder);
               if (!eventFiles) return;

               const eventName = eventFolder.replace(/\\/g, '/').split('/').pop();
               if (!eventName) return;
               const eventFunctions = await Promise.all(eventFiles.map(file => dynamicImportModule(file)));

               client.on(eventName, async (...args: unknown[]) => {
                    for (const eventFunction of eventFunctions) {
                         await eventFunction(client, ...args);
                    }
               });
          }));
     } catch (error) {
          console.log("There was an error in event handle", error);
     }
}