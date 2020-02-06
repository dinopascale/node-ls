import {IFileListItem} from '../interfaces/file-list-item';

export class CacheList {

    private cached: { [key: string]: IFileListItem[] } = {}

    constructor() {}

    insert(path: string, fileList: (IFileListItem | undefined)[] ): void {

        if (!fileList) {
            return;
        }

        if (this.cached[path]) { return; }
        this.cached[path] = [...(fileList as IFileListItem[])];
        console.log('UPDATED CACHE', Object.keys(this.cached));
    }

    retrieve(path: string): IFileListItem[] {
        let fileList = this.cached[path];
        return fileList;
    }

    isCached(path: string): boolean {
        return Object.keys(this.cached).includes(path);
    }

}