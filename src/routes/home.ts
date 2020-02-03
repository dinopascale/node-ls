import { Request, Response } from 'express';
import ls from '../helpers/listing';
import fileStats from '../helpers/stats';
import { homedir } from 'os';




export const index = (path: string = homedir()) => async (req: Request, res: Response) => {

    const filesArray = <string[]>await ls(path);

    try {
        const promises = filesArray.map(f => fileStats(path + '/' + f)
            .then(stats => ({name: f, size: stats.size}))
            .catch(err => undefined)
        );
        const filesWithStats = await Promise.all(promises);

        res.render('home', {
            title: 'Home',
            files: filesWithStats,
            path,
        })
    } catch(e) {
        console.log(e);
    }
}