import { LoliBotClient } from "./clients";
import { table } from 'table';

export const getShardInfo = async (client: LoliBotClient) => {

    const totalGuilds = await client.getTotalGuild();
    const totalMembers = await client.getTotalMember();

    const upTime = client.uptime!;

    const day = Math.floor(upTime / (3600 * 24));
    const hour = Math.floor(upTime % (3600 * 24) / 3600);
    const minute = Math.floor(upTime % 3600 / 60);
    const second = Math.floor(upTime % 60);
    const dDisplay = day > 0 ? day + (day === 1 ? "d" : "d") : "";
    const hDisplay = hour > 0 ? hour + (hour === 1 ? ":" : ":") : "";
    const mDisplay = minute > 0 ? minute + (minute === 1 ? ":" : ":") : "";
    const sDisplay = second > 0 ? second + (second === 1 ? "s" : "s") : "";

    const data: any[] = [
        ['SID', 'Server', 'Members', 'UpTime', 'Ping', 'Ram', 'HRam'],
    ];

    const promise = await client.shard!.broadcastEval(c => {
        return [c.shard?.ids[0], c.guilds.cache.size, c.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0), c.channels.cache.size, c.uptime, c.ws.ping, process.memoryUsage().heapUsed, process.memoryUsage().heapTotal]
    });
  

    let totalram = 0
    let totalHram = 0
    for (const i in promise) {
        const j = promise[i];
        totalram += j[6]!;
        totalHram += j[7]!;
        data.push([j[0], j[1]!.toLocaleString('En-us'), j[2]!.toLocaleString('En-us'), '', j[5] + 'ms', formatBytes(j[6]!), formatBytes(j[7]!)])
    }
    data.push(['TOTAL', totalGuilds.toLocaleString('En-us'), totalMembers.toLocaleString('En-us'), `${dDisplay + hDisplay + mDisplay + sDisplay}`, "", formatBytes(totalram), formatBytes(totalHram)]);

    const tableResult = table(data, {
        header: {
            alignment: "center",
            content: "Shards\nThis is the table about shard using"
        },
        columnDefault: {
            alignment: 'center'
        }
    });

    return tableResult;
}

function formatBytes(bytes: number) {
    if (bytes === 0) return '0 Bytes';
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
};