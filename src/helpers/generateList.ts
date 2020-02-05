import fileStats from './stats';
import formatBytes from './size-converter';
import ls from './listing';

export default async function generateFileList(path: string): Promise<({name: string, size: string} | undefined)[]> {
    const filesArray = <string[]>await ls(path);

    let filesWithStats: ({name: string, size: string} | undefined)[] = [];

    if (filesArray.length === 0) {
        filesWithStats = [];
    } else {
        const promises = filesArray.map(f => fileStats(path + '/' + f)
        .then(stats => ({name: f, size: formatBytes(stats.size)}))
        .catch(err => undefined)
    );
        filesWithStats = await Promise.all(promises);
    }

    return filesWithStats;
}