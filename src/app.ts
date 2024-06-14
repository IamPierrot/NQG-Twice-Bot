import { LoliBotClient } from './utils/clients';
import playerHandler from './handlers/playerHandler';
import { Player } from 'discord-player';

const client = LoliBotClient.getInstance();
const player = new Player(client, configure.opt.discordPlayer);

(async () => {
     player.extractors.loadDefault();
     playerHandler(player);
     await client.start();
})();