import { Request, Response } from 'express';
import * as pt from 'path';
import { generateBackLink } from '../helpers/generateLink';
import app from '../app';
import { promises as asyncFs } from 'fs';
import fileStats from '../helpers/stats';
import { generateStatsForClient } from '../helpers/generateList';
import { CacheList } from '../helpers/cache';

export const createFolder = async (req: Request, res: Response) => {
    const { path, fname } = req.query;
    const hDir = app.get('homePath');
    const cache: CacheList = app.get('cache');

    if (!path) { return res.send({error: 'no path sended'}); }

    const completePath = pt.join(<string>hDir, decodeURI(path));

    try {
        await asyncFs.mkdir(completePath + '/' + fname);
        const stats = await fileStats(completePath + '/' + fname);
        const lastFolder = path === app.get('homePath') ? path : path.split('/').pop();

        cache.invalidatePath(completePath);

        return res.set({'content-type': 'application/json'}).send(generateStatsForClient(stats, fname, lastFolder));
    } catch(e) {
        return res.send({error: 'not created' + e})
    }

}

export const getFolder = (homeDir?: string) =>  async (req: Request, res: Response) => {

    const { path } = req;
    const hDir = homeDir || app.get('homePath');
    
    if (!path) { return res.send('scemo no path'); }
    
    const completePath = pt.join(<string>hDir, decodeURI(path));

    try {

        const backPath = generateBackLink(completePath);

        res.render('home', {
            title: 'NodeLs' + path.replace(/\//g, ' - '),
            route: decodeURI(path).replace('/', ''),
            path: completePath,
            backPath
        })
    } catch(e) {
        console.log(e);
    }
}