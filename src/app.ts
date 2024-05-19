import { LoliBotClient } from './utils/clients';
import eventHandlers from './handlers/eventHandler';
import playerHandler from './handlers/playerHandler';
import { mongoSetup } from './database/database';
import { Player } from 'discord-player';

const client = LoliBotClient.getInstance();

const player = new Player(client, configure.opt.discordPlayer);

mongoSetup().then(() => {
     Promise.all([
          player.extractors.loadDefault(),
          eventHandlers(client), //handler discord event
          playerHandler(player), //handler player event
     ]);
     client.login(configure.app.token);
});