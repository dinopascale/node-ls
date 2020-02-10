import { Request, Response } from 'express';
import app from '../app';

export const index = (path?: string) => async (req: Request, res: Response) => {

    path = path || app.get('homePath');

    try {

        res.render('home', {
            title: 'NodeLs',
            route: 'home',
            path,
        })
    } catch(e) {
        console.log(e);
    }
}