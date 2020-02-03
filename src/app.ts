import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';

const app = express();

app.set('port', process.env.PORT || 3000);

app.set('views', path.join(__dirname, '../views'))
app.set('view engine', 'pug');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => res.send('Hello'))

export default app;