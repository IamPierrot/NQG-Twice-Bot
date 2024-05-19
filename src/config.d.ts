declare interface Config extends Readonly<Record<string, unknown>> {
     readonly MONGO: string;
     readonly app: Readonly<{
          token: string;
          global: boolean;
          guild: string;
          ExtraMessages: boolean;
          loopMessage: boolean;
          client: string;
          prefix: string;
     }>;
     readonly opt: Readonly<{
          idDev: string[];
          maxVol: number;
          spotifyBridge: boolean;
          volume: number;
          leaveOnEmpty: boolean;
          leaveOnEmptyCooldown: number;
          leaveOnEnd: boolean;
          leaveOnEndCooldown: number;
          discordPlayer: {
               ytdlOptions: {
                    quality: string;
                    highWaterMark: number;
               };
          };
     }>;
     readonly levelSystems: Readonly<{
          xp: number;
          cooldown: number;
          extraXP: number;
     }>;
}

declare var configure: Config;