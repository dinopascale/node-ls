import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { homedir } from 'os';
import { CacheList } from './helpers/cache';
import * as homeRoute from './routes/home';
import * as folderRoute from './routes/folder';
import * as filterRoute from './routes/fileList';

const app = express();

const cache = new CacheList();

app.set('port', process.env.PORT || 3000);
app.set('cache', cache);
app.set('homePath', homedir())

app.set('views', path.join(__dirname, '../views'))
app.set('view engine', 'pug');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))


app.get('/', homeRoute.index())
app.get('/stream', filterRoute.index)
app.get('/folder/create', folderRoute.createFolder)
app.get('/*', folderRoute.getFolder())

export default app;