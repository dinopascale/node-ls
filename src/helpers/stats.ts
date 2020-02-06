import {promises as asyncFs, Stats, fstat} from 'fs';
import getSize from 'get-folder-size';

const promisifiedGetSize = (folder: string): Promise<Error | null | number> => {
    return new Promise((resolve, rejects) => {
        getSize(folder, (err: Error | null, size: number) => {
            if (err) { return rejects(err); }
            return resolve(size);
        })
    })
}

const fileStats = async (el: string): Promise<Stats> => {

    try {
        const stats = await asyncFs.stat(el);
        const isFolder = stats.isDirectory();
    
        if (isFolder) {
            const size = <number>await promisifiedGetSize(el);
    
            return {
                ...stats,
                size
            }
        } else {
            return stats;
        }
    } catch(e) {
        throw new Error(e);
    }
}

export default fileStats;