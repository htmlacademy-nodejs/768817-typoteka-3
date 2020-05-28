'use strict';

const express = require(`express`);
const path = require(`path`);

const myRouter = require(`./routes/my`);
const commonRouter = require(`./routes/common`);
const articlesRouter = require(`./routes/articles`);

const PUBLIC_DIR = `public`;
const EXPRESS_DEFAULT_PORT = 8080;

const app = express();

app.use(express.urlencoded({extended: false}));

app.use(`/my`, myRouter);
app.use(``, commonRouter);
app.use(`/articles`, articlesRouter);
app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));

app.set(`views`, path.resolve(__dirname, `templates`));
app.set(`view engine`, `pug`);

app.listen(EXPRESS_DEFAULT_PORT);
