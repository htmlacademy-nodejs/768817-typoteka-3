'use strict';

const http = require(`http`);
const fs = require(`fs`).promises;
const FILE_NAME = `mocks.json`;

const DEFAULT_PORT = 3000;
const HttpCodes = {
  OK: 200,
  NOT_FOUND: 404,
};
const NOT_FOUND_MSG = `Not found`;

const sendResponse = (res, statusCode, message) => {
  const template = `
    <!Doctype html>
      <html lang="ru">
      <head>
        <title>With love from Node</title>
      </head>
      <body>${message}</body>
    </html>`.trim();

  res.statusCode = statusCode;
  res.writeHead(statusCode, {
    'Content-Type': `text/html; charset=UTF-8`,
  });

  res.end(template);
};

const onClientConnect = async (req, res) => {
  switch (req.url) {
    case `/`:
      try {
        const content = await fs.readFile(FILE_NAME);
        const contentParsed = JSON.parse(content);
        const message = contentParsed.map((item) => `<li>${item.title}</li>`).join(``);
        sendResponse(res, HttpCodes.OK, `<ul>${message}</ul>`);
      } catch (err) {
        sendResponse(res, HttpCodes.NOT_FOUND, NOT_FOUND_MSG);
      }
      break;

    default:
      sendResponse(res, HttpCodes.NOT_FOUND, NOT_FOUND_MSG);
      break;
  }
};

module.exports = {
  name: `--server`,
  async run(args) {
    const [customPort] = args;
    const port = customPort || DEFAULT_PORT;

    http.createServer(onClientConnect).listen(port).on(`listening`, (err) => {
      if (err) {
        console.error(`Ошибка при создании сервера`, err);
      }
    });
  }
};
