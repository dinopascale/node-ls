import { Request, Response } from 'express';
import { homedir } from 'os';
import * as pt from 'path';
import generateFileList from '../helpers/generateList';


export const index = (homeDir: string = homedir()) =>  async (req: Request, res: Response) => {

    const { path } = req;
    
    if (!path) { return res.send('scemo no path'); }
    
    const completePath = pt.join(homeDir, path);

    try {

        const files = await generateFileList(completePath);

        res.render('home', {
            title: completePath,
            files,
            path: completePath,
        })
    } catch(e) {
        console.log(e);
    }
}