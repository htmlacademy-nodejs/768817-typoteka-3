'use strict';

const express = require(`express`);
const fs = require(`fs`).promises;
const {keys, includes} = require(`ramda`);

const {FILE_NAME_MOCKS, FILE_CATEGORIES_PATH, HttpCodes} = require(`../../constants`);
const {readContent, getMocks} = require(`../../utils`);
const articlesRouter = require(`./routes/articles`);
const DEFAULT_PORT = 3000;

const {OK, BAD_REQUEST} = HttpCodes;


const app = express();
app.use(express.json());
app.use(`/api/articles`, articlesRouter);

app.get(`/api/posts`, async (req, res) => {
  try {
    const content = await fs.readFile(FILE_NAME_MOCKS);
    const mocks = JSON.parse(content);
    res.json(mocks);
  } catch (err) {
    res.send([]);
  }
});

app.get(`/api/categories`, async (req, res) => {
  try {
    const categories = await readContent(FILE_CATEGORIES_PATH);
    return res.status(OK).json(categories);
  } catch (err) {
    return res.status(BAD_REQUEST).json([]);
  }
});

app.get(`/api/search`, async (req, res) => {
  try {
    const mocks = await getMocks();
    const queryParams = req.query;
    const queryKeys = keys(queryParams);

    let filteredMocks = mocks;
    for (let i = 0; i < queryKeys.length; i++) {
      let a = filteredMocks;
      let currentParam = queryKeys[i];
      filteredMocks = a.filter((item) => includes(queryParams[currentParam], item[currentParam]));
    }
    return res.status(200).json(filteredMocks);
  } catch (err) {
    return res.status(400).json(`try again`);
  }
});

app.use((req, res) => res
  .status(HttpCodes.NOT_FOUND)
  .send(`Not found`));

module.exports = {
  name: `--server`,
  async run(args) {
    const [customPort] = args;
    const port = customPort || DEFAULT_PORT;

    app.listen(port);
  }
};
