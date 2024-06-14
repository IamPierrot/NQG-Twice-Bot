import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ComponentType, EmbedBuilder } from "discord.js";
import { PrefixCommands } from "../../cmds";
import cards from "../../data/cards.json";

interface ICardInfo {
     numArray: string[]
     cardsEmoji: string[]
}

export = {
     name: "blackjack",
     description: "chơi bài xì dách",
     aliases: ["bj", "xd"],
     cooldowns: 5,

     callback: async (client, message, args) => {
          // return await message.reply("Tính năng đang trong quá trình phát triển!");
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
                         `)
                         .setColor("Red")
               ]
          }).then((msg) => setTimeout(() => msg.delete(), 7000));

          const getRandomCards = (numArray: string[], emojiArray: string[]) => {
               const cardsNumber = Object.keys(cards);

               const numOfCard = cardsNumber[Math.floor(Math.random() * cardsNumber.length)];
               const qualities = Object.keys(cards[numOfCard as keyof object]);
               const cardEmojiProperty: string = cards[numOfCard as keyof object][qualities[Math.floor(Math.random() * qualities.length) as keyof object]];
               numArray.push(parseInt(numOfCard) > 10 ? '10' : numOfCard);
               emojiArray.push(cardEmojiProperty);
          }
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

          const caculateScore = (arr: string[]) => {
               return Math.floor(arr.reduce((num, value) => num + parseInt(value), 0))
          }

          const [userCardsInfo, fakeClientCardsInfo] = await Promise.all([
               getCardInfo(),
               getCardInfo(true)
          ]);
          const userScore = caculateScore(userCardsInfo.numArray);

          const embed = new EmbedBuilder()
               .setAuthor({ name: "XÌ DÁCH MIỀN TÂY", iconURL: client.user?.displayAvatarURL() })
               .addFields([
                    {
                         name: `Bài của tôi - [?]`,
                         value: fakeClientCardsInfo.cardsEmoji.join('')
                    },
                    {
                         name: `Bài của bạn - [${userScore}]`,
                         value: userCardsInfo.cardsEmoji.join('')
                    }
               ])

          const getCardButton = new ButtonBuilder()
               .setCustomId('get')
               .setLabel('Bốc tiếp')
               .setStyle(ButtonStyle.Success)
               .setEmoji('💲')
          const holdButton = new ButtonBuilder()
               .setCustomId('hold')
               .setLabel('Giữ bài')
               .setStyle(ButtonStyle.Secondary)
               .setEmoji('🤏')
          const row = new ActionRowBuilder<ButtonBuilder>().addComponents(holdButton, getCardButton)
          const replied = await message.reply({ embeds: [embed], components: [row] });

          const clientCardsInfo = getCardInfo();

          const collector = replied.createMessageComponentCollector({
               componentType: ComponentType.Button,
               time: 60000,
               filter: i => i.user.id == message.author.id,
          });

          let isReward = false;

          const handlerWinner = async (interaction: ButtonInteraction, winner: string, userCardsInfo: ICardInfo, clientCardsInfo: ICardInfo) => {
               const [clientScore, userScore] = [
                    caculateScore(clientCardsInfo.numArray),
                    caculateScore(userCardsInfo.numArray)
               ];
               const embed = new EmbedBuilder()
                    .setAuthor({ name: "XÌ DÁCH MIỀN TÂY", iconURL: client.user?.displayAvatarURL() })
                    .addFields([
                         {
                              name: `Bài của tôi - [${clientScore}]`,
                              value: clientCardsInfo.cardsEmoji.join('')
                         },
                         {
                              name: `Bài của bạn - [${userScore}]`,
                              value: userCardsInfo.cardsEmoji.join('')
                         }
                    ]);
               if (winner != "user" && userScore > 25 || (userCardsInfo.numArray.length < 5 && userScore < 16)) {
                    moneyBet *= 2;
                    embed.setDescription(`Bạn bị phạt **gấp đôi** ${client.customEmoji.coin} do \`${userScore.toLocaleString('en-ES')}\` lớn hơn 25 hoặc bé hơn 16`);
               }

               await displayWinner(interaction, embed, winner);

               isReward = true;
               replied.edit({ embeds: [embed], components: [] });
          };
          const displayWinner = async (interaction: ButtonInteraction, embed: EmbedBuilder, winner: string) => {
               switch (winner) {
                    case "client":
                         embed.setTitle("Bạn đã thua roài")
                         await client.truTien(userId, moneyBet);
                         embed.setColor('DarkOrange');
                         if (!embed.data.description) embed.setDescription(`**Rất tiếc!** bạn đã thua \`${moneyBet.toLocaleString('en-ES')}\` ${client.customEmoji.coin}`);
                         break;
                    case "user":
                         embed.setTitle("Bạn đã thắng roài")
                         await client.addTien(interaction.user.id, moneyBet * 2);
                         embed.setDescription(`**Chúc mừng!** bạn đã thắng \`${moneyBet.toLocaleString('en-ES')}\` ${client.customEmoji.coin}`);
                         embed.setColor('Gold');
                         break;
                    case "draw":
                         embed.setTitle("Hoà roài");
                         embed.setDescription(`**Èo** không lụm được đồng nèo :(`);
                         embed.setColor('Aqua');

                         break;
                    default:
                         await client.truTien(userId, moneyBet);
                         break;
               }
          }

          const determineWinner = (userScore: number, clientScore: number): "user" | "client" | "draw" => {
               if (userScore > 21) {
                    if (clientScore > 21 || clientScore < 16) return "draw";
                    if (clientScore <= 21) return "client";
               }
               else if (userScore <= 21 && userScore >= 16) {
                    if (clientScore > 21) return "user";
                    else if (clientScore <= 21 && clientScore < userScore) return "user";
                    else if (clientScore === userScore) return "draw";
               }

               return "client";
          }

          collector.on('collect', async (interaction: ButtonInteraction) => {
               if (interaction.user.id != message.author.id) return await interaction.followUp({ content: "Hey, nút này không dành cho bạn" }) as unknown as Promise<void>;
               if (interaction.customId === "get") {
                    Promise.all([
                         getRandomCards(userCardsInfo.numArray, userCardsInfo.cardsEmoji),
                    ]);

                    const [clientScore, userScore] = [
                         caculateScore(clientCardsInfo.numArray),
                         caculateScore(userCardsInfo.numArray)
                    ];

                    if (clientCardsInfo.numArray.length < 5 && Math.floor(Math.random() * 3) == 1) {
                         getRandomCards(clientCardsInfo.numArray, clientCardsInfo.cardsEmoji)
                    }

                    const embed = new EmbedBuilder()
                         .setAuthor({ name: "XÌ DÁCH MIỀN TÂY", iconURL: client.user?.displayAvatarURL() })
                         .addFields([
                              {
                                   name: `Bài của tôi - [?]`,
                                   value: fakeClientCardsInfo.cardsEmoji.join('')
                              },
                              {
                                   name: `Bài của bạn - [${userScore}]`,
                                   value: userCardsInfo.cardsEmoji.join('')
                              }
                         ]);

                    replied.edit({ embeds: [embed] });

                    if (userCardsInfo.numArray.length >= 5) {
                         const winner = determineWinner(userScore, clientScore);
                         return await handlerWinner(interaction, winner, userCardsInfo, clientCardsInfo);
                    }
               } else if (interaction.customId === "hold") {
                    let [clientScore, userScore] = [
                         caculateScore(clientCardsInfo.numArray),
                         caculateScore(userCardsInfo.numArray)
                    ]

                    while (clientScore < 21 && clientCardsInfo.numArray.length < 5) {
                         getRandomCards(clientCardsInfo.numArray, clientCardsInfo.cardsEmoji);
                         clientScore = caculateScore(clientCardsInfo.numArray);
                         if (Math.floor(Math.random() * 3) === 1 || clientCardsInfo.cardsEmoji.length >= 5) {
                              break;
                         }
                    }

                    return await handlerWinner(
                         interaction,
                         determineWinner(userScore, clientScore),
                         userCardsInfo,
                         clientCardsInfo);
               }

          });

          collector.on('end', async (collect) => {
               const interaction = collect.last()!;

               if (isReward) return;

               const [clientScore, userScore] = [
                    caculateScore(clientCardsInfo.numArray),
                    caculateScore(userCardsInfo.numArray)
               ]

               return await handlerWinner(
                    interaction,
                    determineWinner(userScore, clientScore),
                    userCardsInfo,
                    clientCardsInfo);
          });

     },
} as const as PrefixCommands;