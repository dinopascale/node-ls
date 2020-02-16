import fileStats from './stats';
import formatBytes from './size-converter';
import ls from './listing';
import app from '../app';
import { IFileListItem } from '../interfaces/file-list-item';
import {generateBreadcrumb} from './generateLink';


export default async function generateFileList(path: string): Promise<(IFileListItem | undefined | Promise<IFileListItem>)[]> {

    let result:(IFileListItem | undefined | Promise<IFileListItem>)[] = [];

    const filesArray = <string[]>await ls(path);

    if (filesArray.length === 0) { 
        result = []; 
    } else { 
        const basePath = path + '/';
        const lastFolder = path === app.get('homePath') ? path : path.split('/').pop();
        result = <Promise<IFileListItem>[]>filesArray.map(f => fileStats(basePath + f)
            .then(stats => {
                return {
                    name: f,
                    size: formatBytes(stats?.size),
                    breadcrumb: generateBreadcrumb(app.get('homePath'), lastFolder + '/' + f),
                    birth: stats?.birthtimeMs,
                    modified: stats?.mtimeMs,
                    lastAccess: stats?.atimeMs,
                    isFolder: stats?.isFolder
                }
            })
            .catch((statsWithoutSize) => {
                console.log('ERROR ', statsWithoutSize, ' file ', f);
                // console.log('perchè anche qui')
                return {
                    name: f,
                    size: 'no info',
                    breadcrumb: generateBreadcrumb(app.get('homePath'), basePath + f),
                    birth: statsWithoutSize.birthtimeMs,
                }
            })
        )
    }

   return result;
}