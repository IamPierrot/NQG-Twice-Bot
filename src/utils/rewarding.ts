import { EmbedBuilder } from "discord.js";
import { LoliBotClient } from "./clients";

export const giveReward = async (client: LoliBotClient, userId: string, level: number, LevelEmbeds: EmbedBuilder) => {
     const randomRewardBelow10 = {
          "1": async () => {
               const money = [100, 400, 200]
               const randMoney = money[Math.floor(Math.random() * money.length)];
               await client.addTien(userId, randMoney);
               LevelEmbeds.setFooter({ text: `Bạn đã nhận thưởng thêm của bot ${randMoney}` })
          },
          "2": async () => {
               const money = [500, 50, 1000]
               const randMoney = money[Math.floor(Math.random() * money.length)];
               await client.addTien(userId, randMoney);
               LevelEmbeds.setFooter({ text: `Bạn đã nhận thưởng thêm của bot ${randMoney}` })
          },
          "3": async () => {
               const money = [800, 75, 800]
               const randMoney = money[Math.floor(Math.random() * money.length)];
               await client.addTien(userId, randMoney);
               LevelEmbeds.setFooter({ text: `Bạn đã nhận thưởng thêm của bot ${randMoney}` })
          }
     }
     const randomRewardAbove10 = {
          "1": async function () {
               const money = [1000, 2000, 1500]
               const randMoney = money[Math.floor(Math.random() * money.length)];
               await client.addTien(userId, randMoney);
               LevelEmbeds.setFooter({ text: `Bạn đã nhận thưởng thêm của bot ${randMoney}` })
          },
          "2": async () => {
               const money = [1400, 500, 2400]
               const randMoney = money[Math.floor(Math.random() * money.length)];
               await client.addTien(userId, randMoney);
               LevelEmbeds.setFooter({ text: `Bạn đã nhận thưởng thêm của bot ${randMoney}` })
          },
          "3": async () => {
               const money = [4000, 20, 1000]
               const randMoney = money[Math.floor(Math.random() * money.length)];
               await client.addTien(userId, randMoney);
               LevelEmbeds.setFooter({ text: `Bạn đã nhận thưởng thêm của bot ${randMoney}` })
          }
     }


     const randomRewardBelow10Keys = Object.keys(randomRewardBelow10);
     const randomRewardAbove10Keys = Object.keys(randomRewardAbove10);

     if (level > 10) {
          const reward = randomRewardAbove10[randomRewardAbove10Keys[Math.floor(Math.random() * randomRewardAbove10Keys.length)] as keyof object] as any;
          await reward();
     } else if (level < 10) {
          const reward = randomRewardBelow10[randomRewardBelow10Keys[Math.floor(Math.random() * randomRewardAbove10Keys.length)] as keyof object] as any
          await reward();
     }
}

export const giveRewardDaily = async (client: LoliBotClient, userId: string, streak: number) => {
     let result = '';
     const randomRewardBelow10 = {
          "1": async () => {
               const money = [1000, 4000, 2000]
               const randMoney = Math.floor(money[Math.floor(Math.random() * money.length)] * (Math.random() * (streak)));
               await client.addTien(userId, randMoney);
               result = `\`${randMoney}\` ${client.customEmoji.coin} **Vcoins**`
          },
          "2": async () => {
               const money = [5000, 500, 1000]
               const randMoney = Math.floor(money[Math.floor(Math.random() * money.length)] * (Math.random() * (streak)));
               await client.addTien(userId, randMoney);
               result = `\`${randMoney}\` ${client.customEmoji.coin} **Vcoins**`
          },
          "3": async () => {
               const money = [800, 700, 800]
               const randMoney = Math.floor(money[Math.floor(Math.random() * money.length)] * (Math.random() * (streak)));
               await client.addTien(userId, randMoney);
               result = `\`${randMoney}\` ${client.customEmoji.coin} **Vcoins**`
          }
     }
     const randomRewardAbove10 = {
          "1": async function () {
               const money = [3000, 2000, 4000]
               const randMoney = Math.floor(money[Math.floor(Math.random() * money.length)] * (Math.random() * (streak)));
               await client.addTien(userId, randMoney);
               result = `\`${randMoney}\` ${client.customEmoji.coin} **Vcoins**`
          },
          "2": async () => {
               const money = [2500, 5000, 2400]
               const randMoney = Math.floor(money[Math.floor(Math.random() * money.length)] * (Math.random() * (streak)));
               await client.addTien(userId, randMoney);
               result = `\`${randMoney}\` ${client.customEmoji.coin} **Vcoins**`
          },
          "3": async () => {
               const money = [4000, 2000, 1900]
               const randMoney = Math.floor(money[Math.floor(Math.random() * money.length)] * (Math.random() * (streak)));
               await client.addTien(userId, randMoney);
               result = `\`${randMoney}\` ${client.customEmoji.coin} **Vcoins**`
          }
     }

     const randomRewardBelow10Keys = Object.keys(randomRewardBelow10);
     const randomRewardAbove10Keys = Object.keys(randomRewardAbove10);

     if (streak > 10) {
          const rewards = randomRewardAbove10[randomRewardAbove10Keys[Math.floor(Math.random() * randomRewardAbove10Keys.length)] as keyof object] as any;
          await rewards();
     } else if (streak < 10) {
          const rewards = randomRewardBelow10[randomRewardBelow10Keys[Math.floor(Math.random() * randomRewardAbove10Keys.length)] as keyof object] as any
          await rewards();
     }
     return result;
}

export const giveSpecialReward = async (client: LoliBotClient, userId: string, embeds: EmbedBuilder) => {
     const rewardIdKeys = Object.keys(client.itemEmoji);

     for (let i = 1; i <= 10; i++) {
          client.addItem(userId, rewardIdKeys[Math.floor(Math.random() * rewardIdKeys.length)], 1);
     }
     
     embeds.setDescription(`
     > Chúc mừng <@${userId}> đã nhận được 10 phần quà giá trị cao <3.
     `)
}
