export class CacheList {

    private cached: { [key: string]: {name: string, size: string}[] } = {}

    constructor() {}

    insert(path: string, fileList: ({name: string, size: string} | undefined)[] ): void {

        if (!fileList) {
            return;
        }

        if (this.cached[path]) { return; }
        this.cached[path] = [...(fileList as {name: string, size: string}[])];
    }

    retrieve(path: string): {name: string, size: string}[] {
        let fileList = this.cached[path];
        return fileList;
    }

    isCached(path: string): boolean {
        return Object.keys(this.cached).includes(path);
    }

}