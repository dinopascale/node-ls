import { Request, Response } from 'express';
import app from '../app';
import {createReadStream} from 'fs';
import * as p from 'path';
const JSONStream = require('JSONStream');

import { Readable, ReadableOptions } from 'stream';
import { IFileListItem } from '../interfaces/file-list-item';

class FolderSizeReadable extends Readable {

    data: IFileListItem[];

    constructor(data: IFileListItem[], options: ReadableOptions) {
        super(options);
        this.data = data;
    }

    _read(size: number) {
        if (this.data.length) {
            const chunk = this.data.slice(0, size);
            this.data = this.data.slice(size, this.data.length);
            this.push(chunk)
        } else {
            this.push(null);
        }
    }
}


export const index = async function (req: Request, res: Response) {
    const { path } = req;
    const hDir = app.get('homePath');

    console.log(path, ' ma semo qui?')

    if (!path) { return res.status(400).send({error: 'Please get stupidino'}); }


    const data = [{ a: 1 }, { b: 2 }, { c: 3 }, { d: 4 }, { e: 5 }];
    const r = new FolderSizeReadable(data, { objectMode: true, highWaterMark: 2});
    
    r
        .pipe(JSONStream.stringify())
        .pipe(res.header('content-type', 'application/json'));

    // readab

    // let stream = createReadStream('/home/dino/projects/node-ls/dist/public/data.txt');
    // stream.pipe(res);
    // stream.on('end', res.end.bind(res))
}