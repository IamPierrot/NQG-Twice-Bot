import { ApplicationCommandOptionType, EmbedBuilder, TextChannel } from 'discord.js';
import { SlashCommands } from '../../cmds';
import whiteListModel from '../../database/models/whiteListModel';

export = {
    name: "whitelist",
    description: 'add user to whitelist in neyucity',
    channelUses: "kêu lon` hàu đưa id channel",
    options: [
        {
            name: "username",
            description: "name of minecraft account that need to be added",
            type: ApplicationCommandOptionType.String,
            required: true

        }
    ],

    callback: async (client, interaction) => {
        const userName = interaction.options.getString("username", true);

        const consoleChannel: TextChannel = client.guilds.cache.get("1070274984116768879")?.channels.cache.get("1223908726499442698") as TextChannel

        let whiteListData = await whiteListModel.findOne({ userId: interaction.user.id });
        if (!whiteListData) whiteListData = new whiteListModel({ userId: interaction.user.id , current: 1});

        await whiteListData.save();

        if (whiteListData.current <= 0) return interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Chỉnh sửa danh sách thất bại!")
                    .setDescription(`${interaction.user.toString()} đã hết lượt sử dụng quyền thêm vào danh sách ưu tiên!`)
                    .setColor("Red")
                    .setFooter({ iconURL: client.user?.avatarURL() ?? undefined, text: "Hãy trở lại vào ngày hôm sau!" })
                    .addFields([
                        {
                            name: "Lượt sử dụng còn lại: ",
                            value: `Bạn còn **${whiteListData.current} / ${whiteListData.limitation}** lượt để thêm vào danh sách ưu tiên!`
                        }
                    ])
            ]
        })

        await consoleChannel.send(`whitelist add ${userName}`);

        whiteListData.current--;

        await whiteListData.save();

        await interaction.editReply({
            embeds: [new EmbedBuilder()
                .setTitle("Chỉnh sửa danh sách thành công")
                .setDescription(`${interaction.user.toString()} đã thêm \`${userName}\` vào danh sách ưu tiên!`)
                .addFields([
                    {
                        name: "Lượt sử dụng còn lại: ",
                        value: `Bạn còn **${whiteListData.current} / ${whiteListData.limitation}** lượt để thêm vào danh sách ưu tiên!`
                    }
                ])
                .setFooter({ text: "Chúc bạn vui vẻ khi chơi neyuQ city", iconURL: interaction.user.avatarURL() ?? undefined })
            ]
        });

    },

} as const as SlashCommands;
