import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import * as homeRoute from './routes/home';

const app = express();

app.set('port', process.env.PORT || 3001);

app.set('views', path.join(__dirname, '../views'))
app.set('view engine', 'pug');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))


app.get('/', homeRoute.index())

export default app;