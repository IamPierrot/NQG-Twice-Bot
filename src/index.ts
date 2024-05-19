import { ShardingManager } from 'discord.js';
import path from 'path';
import config from '../config.json';
import { mongoShutdown } from './database/database';
import chalk from 'chalk';
import { LoliBotClient } from './utils/clients';

try {
    const manager = new ShardingManager(path.join(__dirname, 'app.js'), { token: config.app.token, totalShards: "auto" });
    manager.on('shardCreate', shard => console.log(chalk.blue.bold(`Launched shard ${chalk.bold.red((shard.id))}`)));
    manager.spawn({
        amount: manager.totalShards
    });
} catch (error) {
    console.log(error);
}

process.on('SIGINT', async () => {
    console.log(chalk.redBright.italic('Đang thực hiện ngắt kết nối trước khi thoát...'));

    await mongoShutdown();
    await LoliBotClient.getInstance().destroy();

    console.log(chalk.red.bold("Ngắt kết nối và sao lưu dữ liệu hoàn thành!"))
    process.exit(1);
});