import {promises as asyncFs, Stats, fstat} from 'fs';

const fileStats = async (file: string): Promise<Stats> => {    
    return asyncFs.stat(file);
}

export default fileStats;