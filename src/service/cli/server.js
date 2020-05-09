'use strict';

const express = require(`express`);
const {keys, includes} = require(`ramda`);

const {FILE_CATEGORIES_PATH, HttpCodes} = require(`../../constants`);
const {readContent, getMocks} = require(`../../utils`);
const articlesRouter = require(`./routes/articles`);
const DEFAULT_PORT = 3000;


const app = express();
app.use(express.json());
app.use(`/api/articles`, articlesRouter);

app.get(`/api/categories`, async (req, res) => {
  try {
    const categories = await readContent(FILE_CATEGORIES_PATH);
    return res.status(HttpCodes.OK).json(categories);
  } catch (err) {
    return res.status(HttpCodes.BAD_REQUEST).json([]);
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
    return res.status(HttpCodes.OK).json(filteredMocks);
  } catch (err) {
    return res.status(HttpCodes.BAD_REQUEST).json([]);
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
