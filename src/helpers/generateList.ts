import fileStats from './stats';
import formatBytes from './size-converter';
import ls from './listing';
import app from '../app';
import { CacheList } from './cache';

export default async function generateFileList(path: string): Promise<({name: string, size: string} | undefined)[]> {
    // cache strategy
    let result:({name: string, size: string} | undefined)[] = [];

    const cache = <CacheList>app.get('cache');

    if (cache.isCached(path)) {
        console.log('CACHED')
        result = cache.retrieve(path);
    } else {
        const filesArray = <string[]>await ls(path);
    
        if (filesArray.length === 0) {
            result = [];
            cache.insert(path, result);
        } else {
            const promises = filesArray.map(f => fileStats(path + '/' + f)
            .then(stats => ({name: f, size: formatBytes(stats.size)}))
            .catch(err => ({name: f, size: 'no info'}))
        );
            result = await Promise.all(promises);
            cache.insert(path, result);
        }
    }

    return result;
}