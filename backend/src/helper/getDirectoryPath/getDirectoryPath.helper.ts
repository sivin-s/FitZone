import path from 'path';
import {__filename} from '../getFilePath/getFilePath.helper.ts'

/**
 * @param joiningPath string eg: ../hi/hello.ts
 * @param filePath string eg: __filename() return enter  -  /box/index.js
 * @returns full directory path of the file eg: c://user/...
 */
export const fullDirPath = (__filename:string,joiningPath:string)=> {
    if(!(__filename && joiningPath)){
        return;
    }
    const __dirname =  path.dirname(__filename)
  return  path.join(__dirname,joiningPath)
};

