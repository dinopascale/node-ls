export interface IFileListItem {
    name: string;
    size: string;
    birth?: number;
    modified?: number;
    lastAccess?: number;
    isDirectory?: boolean;
    breadcrumb: string;
}