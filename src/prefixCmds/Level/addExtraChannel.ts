import { Document } from 'mongoose';
import { PrefixCommands } from '../../cmds';
import extraChannelModel, { IextraChannelModel } from '../../database/models/extraChannels';
import { ChannelType, GuildChannel } from 'discord.js';


export = {
     name: "addextrachannel",
     aliases: ["addec", "ec"],
     description: "thêm kênh bonus exp",
     adminOnly: true,
     showHelp: false,

     callback: async (client, message, args) => {
          let extraChannelData = await extraChannelModel.findOne({ guildId: message.guild!.id });
          const removeAliases = ["r", "remove", "xóa", "cook"];

          const isRemove = removeAliases.includes(args[args.length - 1]) ? (() => {
               args.pop();
               return true;
          })() : false;
          const listChannelIdArray = args;

          const pushingIdtoDB = async (database: IextraChannelModel & Document) => {
               const chatChannelIdArray = [...database.chatChannelId] as string[];
               const voiceChannelIdArray = [...database.voiceChannelId] as string[];

               await Promise.all(listChannelIdArray.map(async (element) => {
                    const channelObject = message.guild!.channels.cache.find((channel) => channel.id === element) as GuildChannel;

                    if (channelObject) {
                         if (channelObject.type === ChannelType.GuildText) {
                              if (isRemove) {
                                   database.chatChannelId = chatChannelIdArray.filter((id) => id !== element);
                              } else if (!chatChannelIdArray.includes(element)) {
                                   database.chatChannelId.push(element);
                              }
                         } else if (channelObject.type === ChannelType.GuildVoice) {
                              if (isRemove) {
                                   database.voiceChannelId = voiceChannelIdArray.filter((id) => id !== element);
                              } else if (!voiceChannelIdArray.includes(element)) {
                                   database.voiceChannelId.push(element);
                              }
                         }
                    }
               }));
               await database.save();

          }
          if (extraChannelData) {
               pushingIdtoDB(extraChannelData);
          } else {
               extraChannelData = new extraChannelModel({ guildId: message.guild!.id });
               pushingIdtoDB(extraChannelData);
          }

          isRemove ? await message.reply(`Đã xóa thành công id channel: ${args.map(elm => `<#${elm}>`).join(" ")}`) : await message.reply(`Đã thêm thành công id channel: ${args.map(elm => `<#${elm}>`).join(" ")} `);
     }
} as const as PrefixCommands;