import { promises, Dirent } from 'fs';

function ls(path: string): Promise<string[] | Buffer[] | Dirent[]> {
    return promises.readdir(path)
} 

export default ls;