import { Request, Response } from 'express';
import * as pt from 'path';
import { generateBackLink } from '../helpers/generateLink';
import app from '../app';


export const index = (homeDir?: string) =>  async (req: Request, res: Response) => {

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