import { Request, Response } from 'express';
import ls from '../listing';
import { homedir } from 'os';


export const index = (path: string = homedir()) => async (req: Request, res: Response) => {

    const filesArray = await ls(path);

    res.render('home', {
        title: 'home',
        files: filesArray,
        path,
    })
}