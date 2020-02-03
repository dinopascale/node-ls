import { promises, Dirent } from 'fs';
import { homedir } from 'os';

function ls(path?: string): Promise<string[] | Buffer[] | Dirent[]> {
    return promises.readdir(path || homedir())
} 

export default ls;