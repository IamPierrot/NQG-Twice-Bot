import { ApplicationCommandOption, Interaction, Message, ChatInputCommandInteraction, APIApplicationCommandBasicOption } from "discord.js";
import { LoliBotClient } from "./utils/clients.ts";


export declare interface PrefixCommands extends Record<string, unknown> {
     readonly name: string
     readonly description: string
     aliases?: Array<string>
     adminOnly?: boolean
     cooldowns?: number

     async callback(client: LoliBotClient, message: Message, args: string[]): Promise<void | unknown>
}

export declare interface SlashCommands extends Record<string, unknown> {
     name: string
     description: string
     options?: APIApplicationCommandBasicOption[]

     async callback(client: LoliBotClient, interaction: ChatInputCommandInteraction): Promise<void | unknown>
}