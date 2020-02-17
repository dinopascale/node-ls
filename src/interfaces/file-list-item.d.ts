export interface IFileListItem {
    name: string;
    size: string;
    birth?: number;
    modified?: number;
    lastAccess?: number;
    isFolder?: boolean;
    breadcrumb: string;
}