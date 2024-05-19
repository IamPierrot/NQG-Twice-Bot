import { GuildQueueEvents, Player } from "discord-player";

import path from 'path';
import { readdirSync } from 'fs';

export default (player: Player) => {
     try {
          const PlayerEvents = readdirSync(path.join(__dirname, '..', 'events', 'Player')).filter((file: string) => file.endsWith('.js'));

          for (const file of PlayerEvents) {
               delete require.cache[require.resolve(`../events/Player/${file}`)];
               const PlayerEvent = require(`../events/Player/${file}`);
               player.events.on(file.split('.')[0] as keyof GuildQueueEvents, PlayerEvent.bind(null));
          }
     } catch (error) {
          console.log('There was an error in player event: ', error);
     }
}