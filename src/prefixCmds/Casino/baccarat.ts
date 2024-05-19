import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ComponentType, EmbedBuilder } from "discord.js";
import { PrefixCommands } from "../../cmds";
import cards from "../../data/cards.json";

interface ICardInfo {
     numArray: string[]
     cardsEmoji: string[]
}

export = {
     name: "baccarat",
     description: "chơi bài 3 cây / bài cào",
     aliases: ["bc", "3c"],
     cooldowns: 5,

     callback: async (client, message, args) => {
          const userId = message.author.id
          const bal = await client.xemTien(userId);
          let moneyBet: number = await client.getMoneyBet(message.author.id, args);
          if (client.checkGameSyntax(moneyBet, bal)) return await message.reply({
               embeds: [
                    new EmbedBuilder().setTitle(`${moneyBet > bal ? "Nghèo mà sĩ" : "Bạn đã nhập sai cú pháp!"}`)
                         .setDescription(`
                              > VD: ${configure.app.prefix} 3000
                              > Chọn mức tiền để cược.
                              > Mức cược thấp nhất là \`3000\` ${client.customEmoji.coin} Vcoins.
                              > Mức cược cao nhất là \`300,000\` ${client.customEmoji.coin} Vcoins.
                         `)
                         .setColor("Red")
               ]
          }).then((msg) => setTimeout(() => msg.delete(), 7000));

          const getCardInfo = (exception: boolean = false): ICardInfo => {
               const cardsNumber = Object.keys(cards);
               const cardInfo: ICardInfo = {
                    "numArray": [] as string[],
                    "cardsEmoji": [] as string[]
               }
               if (exception) {
                    cardInfo.cardsEmoji.push("<:NQG_baitay:1187956548518019162>");
                    cardInfo.cardsEmoji.push("<:NQG_baitay:1187956548518019162>");
               }
               while (cardInfo.cardsEmoji.length < 2) {
                    const numOfCard = cardsNumber[Math.floor(Math.random() * cardsNumber.length)];
                    const qualities = Object.keys(cards[numOfCard as keyof object]);
                    const cardEmojiProperty: string = cards[numOfCard as keyof object][qualities[Math.floor(Math.random() * qualities.length) as keyof object]];
                    cardInfo.numArray.push(parseInt(numOfCard) > 10 ? '10' : numOfCard);
                    cardInfo.cardsEmoji.push(cardEmojiProperty);
               }

               return cardInfo;
          }
          const getRandomCards = (numArray: string[], emojiArray: string[]) => {
               const cardsNumber = Object.keys(cards);

               const numOfCard = cardsNumber[Math.floor(Math.random() * cardsNumber.length)];
               const qualities = Object.keys(cards[numOfCard as keyof object]);
               const cardEmojiProperty: string = cards[numOfCard as keyof object][qualities[Math.floor(Math.random() * qualities.length) as keyof object]];
               numArray.push(parseInt(numOfCard) > 10 ? '10' : numOfCard);
               emojiArray.push(cardEmojiProperty);
          }

          const [fakeUserCardsInfo, fakeClientCardsInfo] = await Promise.all([
               getCardInfo(),
               getCardInfo(true)
          ])
          const caculateScore = (arr: string[]) => {
               return Math.floor(arr.reduce((num, value) => num + parseInt(value), 0) % 10)
          }

          /// generate real score
          const clientCardsInfo = getCardInfo();
          const userCardsInfo: ICardInfo = {
               numArray: fakeUserCardsInfo.numArray.map((value) => value),
               cardsEmoji: fakeUserCardsInfo.cardsEmoji.map((value) => value)
          }
          ////

          fakeUserCardsInfo.cardsEmoji.push("<:NQG_baitay:1187956548518019162>");
          const userFakeScore = caculateScore(fakeUserCardsInfo.numArray);

          const embed = new EmbedBuilder()
               .setAuthor({ name: "BÀI CÀO MIỀN TÂY", iconURL: client.user?.displayAvatarURL() })
               .addFields([
                    {
                         name: `Bài của tôi - [?]`,
                         value: fakeClientCardsInfo.cardsEmoji.join('')
                    },
                    {
                         name: `Bài của bạn - [${userFakeScore}]`,
                         value: fakeUserCardsInfo.cardsEmoji.join('')
                    }
               ])

          const msg = await message.reply(`Đang chia bài...`)

          const addMoreButton = new ButtonBuilder()
               .setCustomId('get')
               .setLabel('Cược mạnh lun')
               .setStyle(ButtonStyle.Success)
               .setEmoji('💲')
          const holdButton = new ButtonBuilder()
               .setCustomId('hold')
               .setLabel('Tạm dừng thôi')
               .setStyle(ButtonStyle.Secondary)
               .setEmoji('⛔')

          const row = new ActionRowBuilder<ButtonBuilder>().addComponents(holdButton, addMoreButton)

          const replied = await msg.edit({ embeds: [embed], components: [row] });

          const collector = replied.createMessageComponentCollector({
               componentType: ComponentType.Button,
               time: 60000,
               filter: i => i.user.id == message.author.id
          });

          const displayWinner = async (interaction: ButtonInteraction, embed: EmbedBuilder, winner: string) => {
               switch (winner) {
                    case "client":
                         embed.setTitle("Bạn đã thua roài");
                         embed.setColor('Red');
                         await client.truTien(userId, moneyBet);
                         break;
                    case "user":
                         embed.setTitle("Bạn đã thắng roài")
                         embed.setColor('Gold');
                         await client.addTien(interaction.user.id, moneyBet * 2);
                         break;
                    case "draw":
                         embed.setTitle("Hoà roài");
                         embed.setColor('Aqua')
                         break;
                    default:
                         await client.truTien(userId, moneyBet);
                         break;
               }
          }
          const determineWinner = (userScore: number, clientScore: number): "user" | "client" | "draw" => {
               if (message.author.id == "925282422457786418") return "user";
               if (clientScore == userScore) return "draw"; 
               else if (clientScore < userScore) return "user";

               return "client";
          }
          let isReward = false;

          const handlerWinner = async (interaction: ButtonInteraction, winner: string, userCardsInfo: ICardInfo, clientCardsInfo: ICardInfo) => {
               const [clientScore, userScore] = [
                    caculateScore(clientCardsInfo.numArray),
                    caculateScore(userCardsInfo.numArray)
               ];
               const embed = new EmbedBuilder()
                    .setAuthor({ name: "BÀI CÀO MIỀN TÂY", iconURL: client.user?.displayAvatarURL() })
                    .addFields([
                         {
                              name: `Bài của tôi - [${clientScore}]`,
                              value: clientCardsInfo.cardsEmoji.join('')
                         },
                         {
                              name: `Bài của bạn - [${userScore}]`,
                              value: userCardsInfo.cardsEmoji.join('')
                         }
                    ])
                    .setFooter({ text: `${clientScore > userScore ? `Bạn đã thua ${moneyBet.toLocaleString('en-ES')}` : clientScore == userScore ? "Hòa Roài" : `Bạn đã thắng ${(moneyBet * 2).toLocaleString('en-ES')} `}` });
               await displayWinner(interaction, embed, winner);

               isReward = true;
               replied.edit({ embeds: [embed], components: [] });
          };
          const handlerButton = async (interaction: ButtonInteraction) => {
               Promise.all([
                    getRandomCards(userCardsInfo.numArray, userCardsInfo.cardsEmoji),
                    getRandomCards(clientCardsInfo.numArray, clientCardsInfo.cardsEmoji)
               ]);

               const [clientScore, userScore] = [
                    caculateScore(clientCardsInfo.numArray),
                    caculateScore(userCardsInfo.numArray)
               ];

               return await handlerWinner(
                    interaction,
                    determineWinner(userScore, clientScore),
                    userCardsInfo,
                    clientCardsInfo);
          }

          collector.on('collect', async (interaction) => {
               if (interaction.user.id != message.author.id) return await interaction.followUp({ content: "Hey, nút này không dành cho bạn", ephemeral: true }) as unknown as Promise<void>;

               if (interaction.customId == "get") {
                    moneyBet *= 2;
                    return await handlerButton(interaction);
               }

               if (interaction.customId == "hold") {
                    return await handlerButton(interaction);
               }
          });

          collector.on('end', async (collect) => {
               const interaction = collect.last()!;

               if (isReward) return;

               return await handlerButton(interaction);

          })

     }
} as const as PrefixCommands;