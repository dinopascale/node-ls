import {promises as asyncFs, Stats, fstat, stat} from 'fs';
import getSize from 'get-folder-size';
import {IFileStats} from '../interfaces/file-stats';

const promisifiedGetSize = (folder: string): Promise<Error | null | number> => {
    return new Promise((resolve, rejects) => {
        getSize(folder, (err: Error | null, size: number) => {
            if (err) { return rejects(err); }
            return resolve(size);
        })
    })
}

const fileStats = async (el: string): Promise<IFileStats | undefined> => {

    // try {
    //     const stats = await asyncFs.stat(el);
    //     const isFolder = stats.isDirectory();
    
    //     if (isFolder) {
    //         const size = <number>await promisifiedGetSize(el);
    
    //         return {
    //             ...stats,
    //             size
    //         }
    //     } else {
    //         return stats;
    //     }
    // } catch(e) {
    //     throw new Error(e);
    // }

    try {
        const stats = await asyncFs.stat(el);
        const isFolder = stats.isDirectory();


        if (isFolder) {
            try {
                const size = <number>await promisifiedGetSize(el);
                // console.log('FOLDER' ,el);
                return {
                    ...stats,
                    isFolder,
                    size
                }
            } catch (e) {
                // console.log('ERROR IN PROMISIFIEDGETSIZE', el);
                // throw stats;s
            }
    
        } else {
            // console.log('FILE', el)
            return {...stats, isFolder};       
        }
    } catch(e) {
        // console.log('ERROR IN STAT', el);
        // throw {};
    }

}

export default fileStats;