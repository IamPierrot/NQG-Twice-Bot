import { PrefixCommands } from "../../cmds";

import { ActionRowBuilder, ComponentType, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from 'discord.js';
import { useMainPlayer, QueryType } from 'discord-player';


export = {
     name: 'play',
     description: 'Chơi 1 bài nhạc!',
     aliases: ['p'],
     voiceChannel: true,

     callback: async (client, message, args) => {
          const player = useMainPlayer();

          const song = args[0];
          let res = await player.search(song, {
               requestedBy: message.member!,
               searchEngine: QueryType.AUTO
          });

          const NoResultsEmbed = new EmbedBuilder()
               .setAuthor({ name: `Không tìm thấy bài hát mà bạn muốn tìm.... thử lại? ❌` })
               .setDescription(`Nếu đó là link của playlist Youtube hãy dùng lệnh /playlist`)
               .setColor('#2f3136')

          if (!res.tracks.length) return await message.reply({ embeds: [NoResultsEmbed] });

          const queue = player.queues.cache.last() || player.nodes.create(message.guildId!, { //guildQueue
               metadata: message.channel,
               // spotifyBridge: configure.opt.spotifyBridge,
               volume: configure.opt.volume,
               leaveOnEmpty: configure.opt.leaveOnEmpty,
               leaveOnEmptyCooldown: configure.opt.leaveOnEmptyCooldown,
               leaveOnEnd: configure.opt.leaveOnEnd,
               leaveOnEndCooldown: configure.opt.leaveOnEndCooldown,
          });
          try {
               if (!queue.connection) await queue.connect(message.member!.voice.channel!);
          } catch {
               try {
                    player.queues.delete(message.guildId!);
               } catch { }

               const NoVoiceEmbed = new EmbedBuilder()
                    .setAuthor({ name: `Mình không thể kết nối được với voice channel.... thử lại ? ❌` })
                    .setColor('Red')

               return await message.reply({ embeds: [NoVoiceEmbed] });
          }

          queue.metadata = message.channel;

          const songsEmbed = new EmbedBuilder()
               .setAuthor({ name: `Danh sách phát đang chờ được thêm`, iconURL: message.author.displayAvatarURL() })
               .setTitle("Vui lòng chọn bài hát ở dưới")
               .setColor('#2f3136')
               .setTimestamp()
               .setFooter({ text: 'Âm nhạc đi trước - Tình yêu theo sau ❤️', iconURL: message.author.displayAvatarURL() })


          const menu = new StringSelectMenuBuilder()
               .setCustomId('play')
               .setPlaceholder('Ϛ- Lựa chọn bài hát')
               .setMinValues(1)
               .setMaxValues(1)
               .addOptions(res.tracks.slice(0, 10).map((value, index) => new StringSelectMenuOptionBuilder()
                    .setDescription(value.author)
                    .setLabel(value.title.slice(0, 100))
                    .setValue(index.toString())) as unknown as StringSelectMenuOptionBuilder[]);
          const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(menu);
          const msg = await message.reply({ embeds: [songsEmbed], components: [row] });

          const collector = msg.createMessageComponentCollector({
               filter: i => i.user.id === message.author.id,
               componentType: ComponentType.StringSelect,
               time: 20000
          });

          let isChoice = false;
          collector.on('collect', async (interaction) => {
               if (interaction.customId == "play") {
                    const track = res.tracks[interaction.values[0] as keyof object]; //Track
                    queue.addTrack(track);

                    if (!queue.isPlaying()) {
                         await queue.node.play();
                    }

                    const playEmbed = new EmbedBuilder()
                         .setAuthor({ name: `🎧 ĐÃ THÊM VÀO HÀNG PHÁT`, iconURL: track.requestedBy?.avatarURL()! })
                         .setColor('#4d1aff')
                         .setDescription(`
                         :notes:  **${track.toHyperlink()}** \n \
                         \n \
                         :small_blue_diamond: Được thêm vào bởi : ${track.requestedBy?.toString()} 
                         :small_blue_diamond: Nguồn tìm kiếm : ${track.source}
                         `)
                         .setTimestamp()
                         .setFooter({ text: 'Âm nhạc đi trước - Tình yêu theo sau ❤️' })


                    await msg.edit({ embeds: [playEmbed], components: [] });
               }
               isChoice = true;
          });

          collector.on('end', async (collection) => {
               const interaction = collection.last();
               if (!interaction && isChoice) return;

               const timeOutEmbed = new EmbedBuilder()
                    .setColor('#4d1aff')
                    .setTitle("Hết thời gian chọn nhạc!")
                    .setTimestamp()
                    .setFooter({ text: 'Âm nhạc đi trước - Tình yêu theo sau ❤️' })

               await msg.edit({ embeds: [timeOutEmbed], components: [] });
          })
     }
} as const as PrefixCommands;