'use strict';

const express = require(`express`);
const {keys, includes} = require(`ramda`);

const {FILE_CATEGORIES_PATH, HttpCodes} = require(`../../constants`);
const {readContent, getData} = require(`../../utils`);
const articlesRouter = require(`./routes/articles`);
const {getLogger} = require(`../../logger`);
const DEFAULT_PORT = 3000;

const logger = getLogger();


const app = express();
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

    app.listen(port)
    .on(`error`, (err) => {
      logger.error(`Server can't start. Error: ${err}`);
    });
    logger.info(`server start on ${port}`);
    logger.info(`LOG_LEVEL value is ${process.env.LOG_LEVEL}`);
  },
  app
};
