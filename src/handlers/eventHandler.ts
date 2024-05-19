import path from "path";
import { LoliBotClient } from "../utils/clients";

export = async (client: LoliBotClient) => {
     try {
          const eventFolders: string[] | undefined = client.getAllFiles(path.join(__dirname, '..', 'events'), true);
          if (!eventFolders) throw new Error('No folders events have been found');
          for (const eventFolder of eventFolders) {
               const eventFiles = client.getAllFiles(eventFolder);
               eventFiles.sort((a, b) => a > b ? 1 : 0);

               const eventName = eventFolder.replace(/\\/g, '/').split('/').pop();
               if (!eventName) throw new Error('Invalid eventName');

               client.on(eventName, async (...args: unknown[]) => {
                    for (const eventFile of eventFiles) {
                         const eventFunction = require(eventFile);
                         await eventFunction(client, ...args);
                    }
               });
          }

     } catch (error) {
          console.log("There was an error in event handle", error);
     }
}