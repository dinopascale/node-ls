import { Request, Response } from 'express';
import generateFileList from '../helpers/generateList';
import app from '../app';

export const index = (path?: string) => async (req: Request, res: Response) => {

    path = path || app.get('homePath');

    try {

        const files = await generateFileList(<string>path);

        res.render('home', {
            title: 'Home',
            files,
            path,
        })
    } catch(e) {
        console.log(e);
    }
}