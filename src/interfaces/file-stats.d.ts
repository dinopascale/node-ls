import { Stats } from "fs"

export interface IFileStats extends Stats {
    isFolder: boolean;
}