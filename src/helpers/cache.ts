import {IFileListItem} from '../interfaces/file-list-item';

export class CacheList {

    private cached: { [key: string]: IFileListItem[] } = {}

    constructor() {}

    insert(path: string, fileList: (IFileListItem | undefined)[], isChunk: boolean = false ): void {

        if (!fileList) {
            return;
        }

        if (this.cached[path] && !isChunk) { return; }


        this.cached[path] = isChunk ? [...(this.cached[path] || []), ...(fileList as IFileListItem[])] : [...(fileList as IFileListItem[])];
    }

    retrieve(path: string): IFileListItem[] {
        let fileList = this.cached[path];
        return fileList;
    }

    isCached(path: string): boolean {
        return Object.keys(this.cached).includes(path);
    }

    invalidatePath(path: string): void {
        if(this.isCached(path)) {
            delete this.cached[path];
        }
    }

}