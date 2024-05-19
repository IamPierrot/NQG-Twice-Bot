import { Client, ClientOptions, Collection, EmbedBuilder, GatewayIntentBits, Message, Partials } from "discord.js";
import * as fs from 'fs';
import * as path from 'path';
import { PrefixCommands, SlashCommands } from "../cmds";
import prefixModel from "../database/models/prefixModel";
import balanceModel from "../database/models/balanceModel";
import sourceEmoji from "../data/emoji.json";
import IE from "../data/itemEmoji.json";
import { Track } from "discord-player";
import { BaseComponent, Components, StringSelectMenuComponent, MusicButtonComponent, ButtonStandardComponent } from "../component";
import inventoryModel from "../database/models/inventoryModel";
globalThis.configure = require('../../config.json');


export class LoliBotClient extends Client {
     timeStampUser: Collection<string, NodeJS.Timeout> = new Collection();
     userComponent: Collection<string, { custom_id: string, msg: Message<boolean> }> = new Collection();
     cooldowns: Collection<string, Collection<string, number>> = new Collection();

     readonly PrefixCommands: PrefixCommands[];
     readonly slashCommands: SlashCommands[];
     readonly prefix: string;
     readonly components: Components;
     readonly economyAndCasino: string[] = [];
     readonly customEmoji;
     readonly itemEmoji;

     private static instance: LoliBotClient = new LoliBotClient({
          intents: Object.keys(GatewayIntentBits) as keyof object,
          partials: Object.keys(Partials) as keyof object
     });

     private constructor(clientOptions: ClientOptions) {
          super(clientOptions);

          this.PrefixCommands = [...this.getTextCommands()];
          this.slashCommands = [...this.getLocalCommands()];

          this.customEmoji = sourceEmoji;
          this.itemEmoji = IE;
          this.prefix = (configure.app.prefix);
          this.components = this.getComponents();
     }

     public static getInstance() {
          return LoliBotClient.instance;
     }

     ////////////////////////// Root functions
     public async getTotalGuild() {
          const guild = await this.shard?.fetchClientValues('guilds.cache.size') as unknown as number[];
          return guild?.reduce((total, guildacc) => total + guildacc, 0);
     }
     public async getTotalMember() {
          const member = await this.shard?.broadcastEval(c => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0));
          return member?.reduce((total, mem) => total + mem, 0)!;
     }


     private *getTextCommands(exceptions: string[] = []) {

          const commandCategories = this.getAllFiles(
               path.join(__dirname, '..', 'prefixCmds'),
               true
          );
          const featureCommands = ["Economy", "Casino", "Game", "Level", "Lottery", "Inventory"]
          for (const commandCategory of commandCategories) {
               const commandFiles = this.getAllFiles(commandCategory);
               const commandCategoryName = commandCategory.replace(/\\/g, '/').split('/').pop();

               for (const commandFile of commandFiles) {
                    const commandObject: PrefixCommands = require(commandFile);
                    if (exceptions.includes(commandObject.name)) {
                         continue;
                    }
                    if (featureCommands.includes(commandCategoryName!)) this.economyAndCasino.push(commandObject.name);
                    yield commandObject;
               }
          }
     }

     private *getLocalCommands(exceptions: string[] = []) {
          const commandCategories = this.getAllFiles(
               path.join(__dirname, '..', 'commands'),
               true
          );

          for (const commandCategory of commandCategories) {
               const commandFiles = this.getAllFiles(commandCategory);


               for (const commandFile of commandFiles) {
                    const commandObject: SlashCommands = require(commandFile);

                    if (exceptions.includes(commandObject.name)) {
                         continue;
                    }
                    yield commandObject;
               }
          }
     }

     private getComponents(exceptions: string[] = []): Components {
          const menus = [] as StringSelectMenuComponent[];
          const musicButtons = [] as MusicButtonComponent[];
          const standardButtons = [] as ButtonStandardComponent[];

          const componentsCategories = this.getAllFiles(
               path.join(__dirname, '..', 'components'),
               true
          );
          for (const componentTypeDirectory of componentsCategories) {
               const components = this.getAllFiles(componentTypeDirectory);
               const componentName = componentTypeDirectory.replace(/\\/g, '/').split('/').pop();

               for (const component of components) {
                    const componentObject = require(component) as BaseComponent;
                    switch (componentName) {
                         case "menu":
                              menus.push(componentObject);
                              break;
                         case "button":
                              if (componentObject.type === 'music') {
                                   musicButtons.push(componentObject);
                              } else if (componentObject.type === 'standard') {
                                   standardButtons.push(componentObject);
                              }
                              break;
                         default:
                              break;
                    }
               }

          }

          return {
               menus: menus, buttons: {
                    musics: musicButtons,
                    normal: standardButtons
               }
          };
     }


     public getAllFiles(directory: string, foldersOnly: boolean = false): string[] {
          const fileNames: string[] = [];
          try {
               const files = fs.readdirSync(directory, { withFileTypes: true });
               for (const file of files) {
                    const filePath = path.join(directory, file.name);

                    if (foldersOnly) {
                         if (file.isDirectory()) {
                              fileNames.push(filePath);
                         }
                    } else {
                         if (file.isFile()) {
                              fileNames.push(filePath);
                         }
                    }
               }

          } catch (error) {
               console.log(`There was an error in ${directory} : ${error}`);
          }

          return fileNames;
     }

     public async getPrefix(guildId: string) {
          const prefixData = await prefixModel.findOne({ guildId: guildId });
          if (!prefixData) return null;
          return prefixData.prefix;
     }

     /////////////////////////////////////


     ///////////////////// Music Functions
     public checkIdRequest(track: Track, userId: string): EmbedBuilder | boolean {
          if (track.requestedBy!.id !== userId) {
               return new EmbedBuilder()
                    .setAuthor({ name: `❌ Có lỗi khi yêu cầu dừng/bỏ qua bài hát` })
                    .setDescription(`Bài hát này là yêu cầu của : ${track.requestedBy?.toString()}`)
          } else {
               return false;
          }
     };





     ////////// Economy functions
     public xemTien(userId: string): Promise<number> {
          return new Promise(async ful => {
               const data = await balanceModel.findOne({ userId: userId });
               if (!data) return false;
               ful(data.money);
          });
     }
     public async addTien(userId: string, soTien: number) {
          try {
               let data = await balanceModel.findOne({ userId: userId });
               if (!data) return false;
               else data.money += soTien;
               await data.save();
               return true;
          } catch (err) {
               console.log("Lỗi add tiền: ", err);
          }
     }
     public async truTien(userId: string, soTien: number) {
          try {
               const data = await balanceModel.findOne({ userId: userId });
               if (!data) return false;
               else data.money -= soTien;
               await data.save();
               return true;
          } catch (err) {
               console.log("Lỗi trừ tiền: ", err);
          }
     }
     ///////////////////////////////////////////

     ///////////// Casino functions
     public checkGameSyntax(moneyBet: number, userBal: number) {
          return !moneyBet
               || isNaN(moneyBet)
               || moneyBet < 3000
               || moneyBet > 3e5
               || moneyBet > userBal
     }
     public async getMoneyBet(userId: string, args: string[]) {
          const moneyBet = args[0];
          const userBal = await this.xemTien(userId);
          return moneyBet === "all" ? userBal > 3e5 ? 3e5 : userBal : parseInt(moneyBet);
     }


     ////////////// Inventory function
     public async addItem(userId: string, itemId: string, amount: number): Promise<boolean> {
          if (itemId == "coin") {
               await this.addTien(userId, amount);
               return true;
          }

          const userInventory = await inventoryModel.findOne({ userId: userId });
          if (!userInventory) return false;
          if (userInventory.items?.[itemId as keyof object] == undefined) return false;

          (userInventory.items[itemId as keyof object] as number) += amount;

          await userInventory.save();
          return true;
     }
     public async removeItem(userId: string, itemId: string, amount: number): Promise<boolean> {
          const userInventory = await inventoryModel.findOne({ userId: userId });
          if (!userInventory) return false;
          if (userInventory.items?.[itemId as keyof object] == undefined) return false;

          (userInventory.items[itemId as keyof object] as number) -= amount;

          await userInventory.save();
          return true;
     }
     ///////////////////////////////////////////
} 