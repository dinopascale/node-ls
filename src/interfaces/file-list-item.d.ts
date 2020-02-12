export interface IFileListItem {
    name: string;
    size: string;
    birth?: number;
    isDirectory?: boolean;
    breadcrumb: string;
}