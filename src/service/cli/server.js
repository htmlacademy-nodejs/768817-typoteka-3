'use strict';

const express = require(`express`);
const {keys, includes, isNil, isEmpty} = require(`ramda`);

const {FILE_CATEGORIES_PATH, HttpCodes} = require(`../../constants`);
const {readContent, getData} = require(`../../utils`);
const articlesRouter = require(`./routes/articles`);
const {getLogger} = require(`../../logger`);
const DEFAULT_PORT = 3000;

const logger = getLogger();
const app = express();

const checkArticles = async () => {
  try {
    const articles = await getData();
    if (isNil(articles) || isEmpty(articles)) {
      return logger.warn(`There are no articles in store. We recomend you call command: "npm start -- --generate [articles count]" before start the server`);
    }
    return logger.info(`Current number of articles in store: ${articles.length}`);
  } catch (err) {
    return logger.warn(`There are no articles in store. We recomend you call command: "npm start -- --generate [articles count]" then restart the server`);
  }
};

app.use(express.json());
app.use((req, res, next) => {
  logger.debug(`Start request to url: ${req.url}`);
  next();
});

app.use(`/api/articles`, articlesRouter);

app.get(`/api/categories`, async (req, res) => {
  logger.info(`End request with status code ${res.statusCode}`);
  try {
    const categories = await readContent(FILE_CATEGORIES_PATH);
    return res.status(HttpCodes.OK).json(categories);
  } catch (err) {
    return res.status(HttpCodes.INTERNAL_SERVER_ERROR).json([]);
  }
});

app.get(`/api/search`, async (req, res) => {
  logger.info(`End request with status code ${res.statusCode}`);
  try {
    const mocks = await getData();
    const queryParams = req.query;
    const queryKeys = keys(queryParams);

    let filteredMocks = mocks;
    for (let i = 0; i < queryKeys.length; i++) {
      let a = filteredMocks;
      let currentParam = queryKeys[i];
      filteredMocks = a.filter((item) => includes(queryParams[currentParam], item[currentParam]));
    }
    return res.status(HttpCodes.OK).json(filteredMocks);
  } catch (err) {
    return res.status(HttpCodes.BAD_REQUEST).json([]);
  }
});

app.use((req, res) => {
  res
  .status(HttpCodes.NOT_FOUND)
  .send(`Not found`);
  logger.error(`End request with error ${res.statusCode}`);
});

module.exports = {
  name: `--server`,
  async run(args) {
    const [customPort] = args;
    const port = customPort || DEFAULT_PORT;

    checkArticles();
    app.listen(port)
    .on(`error`, (err) => {
      logger.error(`Server can't start. Error: ${err}`);
    });
    logger.info(`server starts on: localhost:${port}`);
    logger.info(`LOG_LEVEL value is ${process.env.LOG_LEVEL}`);
  },
  app
};
