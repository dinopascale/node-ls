import { Request, Response } from 'express';
import app from '../app';
const JSONStream = require('JSONStream');

import { Readable, ReadableOptions } from 'stream';
import { IFileListItem } from '../interfaces/file-list-item';
import generateFileList from '../helpers/generateList';
import { Subject, Subscription } from 'rxjs';
import { bufferCount } from 'rxjs/operators';
import { CacheList } from '../helpers/cache';

class FolderSizeReadable extends Readable {

    subj: Subject<IFileListItem>;
    sub: Subscription;

    data: any[];
    filesLength: number = 0;

    constructor(data: any[], options: ReadableOptions) {
        super(options);
        this.data = data;

        this.filesLength = this.data.length;
        this.subj = new Subject<IFileListItem>();
        this.sub = this.subj
            .asObservable()
            .pipe(bufferCount(options.highWaterMark || 5))
            .subscribe(
                chunk => {
                    this.push(chunk)
                },
                err => this.push(null))
    }

    async _read(size: number) {
        if (this.data.length < size) {
            /*
            * if last chunk of data is smaller than highWaterMark param
            * we flush subject, complete and subscribe. Then we push to stream null and stop it
            */

            for await (let file of this.data) {
                this.subj.next(file);
            }

            this.subj.complete();
            this.sub.unsubscribe();
            this.push(null);
            return;
        }

        if (this.data.length > 0) {

            const chunk = this.data.slice(0, size);

            for await (let file of chunk) {
                // console.log(file, ' FILE');
                this.subj.next(file);
            }

            this.data = this.data.slice(size, this.data.length);

        }
    }
}

export const index = async function (req: Request, res: Response) {
    const { path: tempPath } = req;

    const cache: CacheList = app.get('cache');

    if (!tempPath) { return res.status(400).send({error: 'Please get stupidino'}); }

    const hDir = app.get('homePath');

    let path = tempPath.replace('/stream', '');

    const completePath = path === '/home' ? hDir : hDir + path;

    const isCached = cache.isCached(completePath);

    // caching first

    // if cache exist return cache to stream

    // if cache not exist calculate

    const files = isCached ? cache.retrieve(completePath) : await generateFileList(completePath);

    const r = new FolderSizeReadable(files, { objectMode: true, highWaterMark: 3});
    
    r
        .pipe(JSONStream.stringify(false))
        .pipe(res.set({'content-type': 'application/json'}));

    r.on('data', (chunk) => {
        !isCached && cache.insert(completePath, chunk, true)
    })

    r.on('end', () => {})
}