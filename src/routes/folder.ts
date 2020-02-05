import { Request, Response } from 'express';
import ls from '../helpers/listing';
import fileStats from '../helpers/stats';
import { homedir } from 'os';
import * as pt from 'path';
import { Stats } from 'fs';


export const index = (homeDir: string = homedir()) =>  async (req: Request, res: Response) => {

    const {path} = req;
    
    if (!path) { res.send('scemo no path') }
    
    const completePath = pt.join(homeDir, path);

    try {

        const filesArray = <string[]>await ls(completePath);

        let filesWithStats: ({name: string, size: number} | undefined)[] = [];

        if (filesArray.length === 0) {
            filesWithStats = [];
        } else {
            const promises = filesArray.map(f => fileStats(completePath + '/' + f)
            .then(stats => ({name: f, size: stats.size}))
            .catch(err => undefined)
        );
            filesWithStats = await Promise.all(promises);
        }

        res.render('home', {
            title: completePath,
            files: filesWithStats,
            path: completePath,
        })
    } catch(e) {
        console.log(e);
    }
}