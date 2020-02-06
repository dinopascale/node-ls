import { Request, Response } from 'express';
import * as pt from 'path';
import generateFileList from '../helpers/generateList';
import { generateBackLink } from '../helpers/generateLink';
import app from '../app';


export const index = (homeDir?: string) =>  async (req: Request, res: Response) => {

    const { path } = req;
    const hDir = homeDir || app.get('homePath');
    
    if (!path) { return res.send('scemo no path'); }

    console.log(decodeURI(path));
    
    const completePath = pt.join(<string>hDir, decodeURI(path));

    try {

        const backPath = generateBackLink(completePath);
        const files = await generateFileList(completePath);

        res.render('home', {
            title: completePath,
            files,
            path: completePath,
            backPath
        })
    } catch(e) {
        console.log(e);
    }
}