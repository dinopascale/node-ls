import fileStats from './stats';
import formatBytes from './size-converter';
import ls from './listing';
import app from '../app';
import { CacheList } from './cache';
import { IFileListItem } from '../interfaces/file-list-item';
import {generateBreadcrumb} from './generateLink';


export default async function generateFileList(path: string): Promise<(IFileListItem | undefined | Promise<IFileListItem>)[]> {

    let result:(IFileListItem | undefined | Promise<IFileListItem>)[] = [];

    const filesArray = <string[]>await ls(path);

    console.log(path);

    if (filesArray.length === 0) { 
        result = []; 
    } else { 
        const basePath = path + '/'; 
        result = <Promise<IFileListItem>[]>filesArray.map(f => fileStats(basePath + f)
        .then(stats => ({name: f, size: formatBytes(stats.size), breadcrumb: generateBreadcrumb(app.get('homePath'), basePath + f)}))
        .catch(err => ({name: f, size: 'no info', breadcrumb: generateBreadcrumb(app.get('homePath'), basePath + f)})))
    }

    // const cache = <CacheList>app.get('cache');

    // if (cache.isCached(path)) {
    //     result = cache.retrieve(path);
    // } else {
    //     const filesArray = <string[]>await ls(path);
    
    //     if (filesArray.length === 0) {
    //         result = [];
    //         cache.insert(path, result);
    //     } else {
    //         const basePath = path + '/'; 
    //         const promises: Promise<IFileListItem>[] = filesArray.map(f => fileStats(basePath + f)
    //         .then(stats => ({name: f, size: formatBytes(stats.size), breadcrumb: generateBreadcrumb(app.get('homePath'), basePath + f)}))
    //         .catch(err => ({name: f, size: 'no info', breadcrumb: generateBreadcrumb(app.get('homePath'), basePath + f)}))
    //     );
    //         result = await Promise.all(promises);
    //         cache.insert(path, result);
    //     }
    // }

    return result;
}