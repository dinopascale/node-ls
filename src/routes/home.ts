import { Request, Response } from 'express';
import generateFileList from '../helpers/generateList';
import { homedir } from 'os';

export const index = (path: string = homedir()) => async (req: Request, res: Response) => {

    try {

        const files = await generateFileList(path);

        res.render('home', {
            title: 'Home',
            files,
            path,
        })
    } catch(e) {
        console.log(e);
    }
}