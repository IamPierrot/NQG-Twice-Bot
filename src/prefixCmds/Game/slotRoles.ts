import { PrefixCommands } from "../../cmds";

const Probability = require("probability-node");
// import gachaUserModel from '../../database/models/userDataJob/gachaUserModel';
// import emoji from '../../emoji.json';

export = {
    name: "slotrole",
    description: "",
    aliases: ["sr"],

    callback: async (client, message, args) => {
        return await message.reply("Tính năng đang trong quá trình phát triển!");
        const author = message.member;
        const slots = [
            "<:1_:1187187920407363624>",
            "<:2_:1187187924505202769>",
            "<:3_:1187187928712085544>",
            "<:4_:1187187931241259120>",
            "<:5_:1187187934772867082>",
            "<:6_:1187187938883293285>",
            "<:7_:1187719697328771122>",
            "<:8_:1187719701153980457>",
            "<:9_:1187719705025327196>",
            "<:10:1187719707126673528>",
            "<:11:1187719710859608095>",
            "<:12:1187719713011269802>",
        ]
        const moving = `<a:gift22:1187036860149665832>`;

        // const userDataGacha = await gachaUserModel.findOne({ userId: message.author.id });
        // if (!userDataGacha || userDataGacha.soLuong <= 0) 
        //     return message.reply(`${emoji.fail} Bạn không có 1 vé gacha roles nào 🎟️ !!!`);

        let rslots: string[] = [];
        let roleNum = 0;
        let rand = [
            {
                p: 5, f: async () => {
                    rslots.push(slots[0]);
                    rslots.push(slots[0]);
                    rslots.push(slots[0]);
                    roleNum = 1;
                }
            },
            {
                p: 5, f: async () => {
                    rslots.push(slots[1]);
                    rslots.push(slots[1]);
                    rslots.push(slots[1]);
                    roleNum = 2;
                }
            },
            {
                p: 5, f: async () => {
                    rslots.push(slots[2]);
                    rslots.push(slots[2]);
                    rslots.push(slots[2]);
                    roleNum = 3;
                }
            },
            {
                p: 5, f: async () => {
                    rslots.push(slots[3]);
                    rslots.push(slots[3]);
                    rslots.push(slots[3]);
                    roleNum = 4;
                }
            },
            {
                p: 5, f: async () => {
                    rslots.push(slots[4]);
                    rslots.push(slots[4]);
                    rslots.push(slots[4]);
                    roleNum = 5;
                }
            },
            {
                p: 5, f: async () => {
                    rslots.push(slots[5]);
                    rslots.push(slots[5]);
                    rslots.push(slots[5]);
                    roleNum = 6;
                }
            },
            {
                p: 5, f: async () => {
                    rslots.push(slots[6]);
                    rslots.push(slots[6]);
                    rslots.push(slots[6]);
                    roleNum = 7;
                }
            },
            {
                p: 5, f: async () => {
                    rslots.push(slots[7]);
                    rslots.push(slots[7]);
                    rslots.push(slots[7]);
                    roleNum = 8;
                }
            },
            {
                p: 5, f: async () => {
                    rslots.push(slots[8]);
                    rslots.push(slots[8]);
                    rslots.push(slots[8]);
                    roleNum = 9;
                }
            },
            {
                p: 5, f: async () => {
                    rslots.push(slots[9]);
                    rslots.push(slots[9]);
                    rslots.push(slots[9]);
                    roleNum = 10;
                }
            },
            {
                p: 5, f: async () => {
                    rslots.push(slots[10]);
                    rslots.push(slots[10]);
                    rslots.push(slots[10]);
                    roleNum = 11;
                }
            },
            {
                p: 5, f: async () => {
                    rslots.push(slots[11]);
                    rslots.push(slots[11]);
                    rslots.push(slots[11]);
                    roleNum = 12;
                }
            },
            {
                p: 7, f: async () => {
                    var slot1 = Math.floor(Math.random() * (slots.length - 1));
                    var slot2 = Math.floor(Math.random() * (slots.length - 1));
                    var slot3 = Math.floor(Math.random() * (slots.length - 1));

                    if (slot3 == slot1)
                        slot2 = (slot1 + Math.ceil(Math.random() * (slots.length - 2))) % (slots.length - 1);
                    if (slot2 == slots.length - 2) slot2++;

                    rslots.push(slots[slot1]);
                    rslots.push(slots[slot2]);
                    rslots.push(slots[slot3]);
                }
            },
        ]
        const probabilitilized = new Probability(...rand.map(entry => ({ p: `${entry.p}%`, f: entry.f })));
        await probabilitilized();

        const winmsg = roleNum == 0 ? "cái nịt" : "một role...";
        const authorName = `<@${author!.id}>`
        let displaySlots =
            '**   `___ROLES___`**\n` ` ' +
            moving +
            ' ' +
            moving +
            ' ' +
            moving +
            ' ` ` ' +
            authorName +
            ' đã bỏ ra 1 🎟️ và...' +
            '\n  `=============`\n  `====[...]====`';

        const msg = await message.channel.send(displaySlots);

        setTimeout(async () => {
            const displaySlots =
                '**   `___ROLES___`**\n` ` ' +
                rslots[0] +
                ' ' +
                moving +
                ' ' +
                moving +
                ' ` ` ' +
                authorName +
                ' đã bỏ ra 1 🎟️ và...' +
                '\n  `=============`\n  `====[...]====`';
            msg.edit(displaySlots);

            setTimeout(async () => {
                const displaySlots =
                    '**   `___ROLES___`**\n` ` ' +
                    rslots[0] +
                    ' ' +
                    moving +
                    ' ' +
                    rslots[2] +
                    ' ` ` ' +
                    authorName +
                    ' đã bỏ ra 1 🎟️ và...' +
                    '\n  `=============`\n  `====[...]====`';
                msg.edit(displaySlots);

                setTimeout(async () => {
                    const displaySlots =
                        '**   `___ROLES___`**\n` ` ' +
                        rslots[0] +
                        ' ' +
                        rslots[1] +
                        ' ' +
                        rslots[2] +
                        ' ` ` ' +
                        authorName +
                        ' đã bỏ ra 1 🎟️ và...' +
                        '\n  `=============`   và nhận được ' +
                        winmsg +
                        '\n  `====[...]====`';
                    msg.edit(displaySlots);
                }, 1000)
            }, 700);
        }, 1000);
    }
} as const as PrefixCommands;