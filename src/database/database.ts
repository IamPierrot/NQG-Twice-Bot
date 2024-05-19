import chalk from 'chalk';
import * as mongoose from 'mongoose'

export const mongoSetup = async () => {
     console.log(chalk.green.italic("Đang kết nối với database..."));

     await mongoose.connect(configure.MONGO, {
          dbName: "Levels",
     })
          .then(() => console.log(chalk.bold.green("✅ Đã kết nối thành công với database!")))
          .catch((error) => {
               console.error("There was an error when connect to database: ", error);
               process.exit(1);
          })
}

export const mongoShutdown = async () => {
     await mongoose.disconnect();
}
