import { PrefixCommands } from '../../cmds';
import keyData from '../../data/data_module.json';
import printData from '../../data/data_print.json';
import { EmbedBuilder } from 'discord.js';

export = {
     name: 'findverb',
     description: 'tìm động từ bất quy tắc',
     aliases: ['fv', 'v'],

     callback: async (client, message, args) => {
          const standardString = (string: string) => {
               return string.split('').map((char) => {
                    if (char >= 'a' && char <= 'z') {
                         return char;
                    }
                    return;
               }).join('');
          };
          const verb = standardString(args[0]?.toLowerCase());

          const getKeyFromData = (value: string) => {
               return Object.entries(keyData).reduce((key, [keys, arr]) => {
                    if (arr.includes(value)) {
                         key = keys;
                    };
                    return key;

               }, '');
          }
          const realKey = getKeyFromData(verb);
          if (!realKey) return await message.reply('Không tìm thấy từ!');

          const data_verb = printData[realKey as keyof object] as string;
          const verb1 = `**${data_verb[0].toUpperCase()}**`;
          const verb2 = `**${data_verb[1].toUpperCase()}**`;
          const verb3 = `**${data_verb[2].toUpperCase()}**`;
          const meaning = `**${data_verb[3]}**`;


          const englishEmbeds = new EmbedBuilder()
               .setColor(0x0099FF)
               .setTitle('Tìm động từ bất quy tắc')
               .setDescription(` Đây là danh sách từ bạn muốn tìm: `)
               .addFields(
                    { name: 'Verb base form :regional_indicator_v: :one:', value: verb1 },
                    { name: 'Verb past form :regional_indicator_v: :two:', value: verb2 },
                    { name: 'Verb past participle form :regional_indicator_v: :three:', value: verb3 },
               )
               .addFields({ name: 'Nghĩa của động từ', value: meaning })
               .setTimestamp()
               .setFooter({ text: 'Chúc bạn 1 ngày vui vẻ :3' });

          await message.reply({ embeds: [englishEmbeds] });
     }
} as const as PrefixCommands;