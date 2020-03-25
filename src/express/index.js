'use strict';

const express = require(`express`);
const myRouter = require(`./routes/my`);
const commonRouter = require(`./routes/common`);
const articlesRouter = require(`./routes/articles`);

const EXPRESS_DEFAULT_PORT = 8080;

const app = express();

app.use(`/my`, myRouter);
app.use(`/`, commonRouter);
app.use(`/articles`, articlesRouter);

app.listen(EXPRESS_DEFAULT_PORT);
