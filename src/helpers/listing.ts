import { promises as asyncFs, Dirent } from 'fs';

async function ls(path: string): Promise<string[] | Buffer[] | Dirent[]> {
    return await asyncFs.readdir(path)
}

export default ls;