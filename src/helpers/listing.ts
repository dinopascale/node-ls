import { promises as asyncFs, Dirent } from 'fs';

function ls(path: string): Promise<string[] | Buffer[] | Dirent[]> {
    return asyncFs.readdir(path)
} 

export default ls;