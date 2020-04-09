'use strict';

const express = require(`express`);
const fs = require(`fs`).promises;

const FILE_NAME = `mocks.json`;
const DEFAULT_PORT = 3000;
const HttpCodes = {
  OK: 200,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

const app = express();
app.use(express.json());

app.get(`/posts`, async (req, res) => {
  try {
    const content = await fs.readFile(FILE_NAME);
    const mocks = JSON.parse(content);
    res.json(mocks);
  } catch (err) {
    res.send([]);
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
