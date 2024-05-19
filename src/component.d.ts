import { ButtonInteraction, Message, StringSelectMenuInteraction } from "discord.js"
import { LoliBotClient } from "./utils/clients"
import { GuildQueue } from "discord-player"

export type BaseComponent = {
     name: string
     type: any
     callback: (client: LoliBotClient, interaction: unknown) => Promise<unknown>
}
export type Components = {
     menus: StringSelectMenuComponent[]
     buttons: {
          musics: MusicButtonComponent[],
          normal: ButtonStandardComponent[]
     }
}

export declare interface StringSelectMenuComponent extends BaseComponent {
     callback: (client: LoliBotClient, interaction: StringSelectMenuInteraction, values: string[]) => Promise<unknown>
}
export declare interface MusicButtonComponent extends BaseComponent {
     readonly type: 'music'
     callback: (client: LoliBotClient, interaction: ButtonInteraction, customId: string, queue: GuildQueue) => Promise<unknown>
}
export declare interface ButtonStandardComponent extends BaseComponent {
     readonly type: 'standard'
     callback: (client: LoliBotClient, interaction: ButtonInteraction, customId: string, message: Message<boolean> | undefined) => Promise<unknown>
}
