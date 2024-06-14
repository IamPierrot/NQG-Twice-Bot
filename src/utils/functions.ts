import path from "path";
import fs from 'fs';
// import { pathToFileURL } from "url";
import chalk from "chalk";

export function getAllFiles(directory: string, foldersOnly: boolean = false): string[] {
     const fileNames: string[] = [];
     try {
          const files = fs.readdirSync(directory, { withFileTypes: true });
          for (const file of files) {
               const filePath = path.join(directory, file.name);

               if (foldersOnly) {
                    if (file.isDirectory()) {
                         fileNames.push(filePath);
                    }
               } else {
                    if (file.isFile()) {
                         fileNames.push(filePath);
                    }
               }
          }

     } catch (error) {
          console.log(`There was an error in ${directory} : ${error}`);
     }

     return fileNames;
}
export const dynamicImportModule = async (filePath: string) => {
     try {
          // const fileUrl = pathToFileURL(path.resolve(filePath)).href;
          const module = await import(filePath);
          // Check for ES6 default export
          return module.default || module;
     } catch (error) {
          console.log(chalk.red.bold(`Error importing module ${filePath}:`, error));
     }
}