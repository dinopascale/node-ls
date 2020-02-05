import { promises as asyncFs, Dirent } from 'fs';

// async function ls(path: string): Promise<string[] | Buffer[] | Dirent[]> {
//     return await asyncFs.readdir(path)
// } 

async function ls(path: string): Promise<string[] | Buffer[] | Dirent[] | Error> {
    try {
        const d = await asyncFs.readdir(path);
        return d;
    } catch(e) {
        throw new Error(e);
    }
}

export default ls;