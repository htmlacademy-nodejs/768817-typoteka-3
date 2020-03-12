'use strict';

const http = require(`http`);

const styles = `
h1 {
  color: red;
  font-size: 24px;
}

p {
  color: green;
  font-size: 16px;
}`;

const getResponseText = (userAgent) => (`
  <!Doctype html>
  <html lang="ru">
    <head>
      <title>From Node with love!</title>
      <link rel="stylesheet" href="style.css">
    </head>
    <body>
      <h1>Привет!</h1>
      <p>Ты используешь: ${userAgent}.</p>
    </body>
  </html>
`);

const onClientConnect = (request, response) => {
  const HTTP_SUCCESS_CODE  = 200;
  const HTTP_NOT_FOUND_CODE  = 404;
  const userAgent = request.headers[`user-agent`];
  const responseText = `
  <!Doctype html>
    <html lang="ru">
    <head>
      <title>From Node with love!</title>
      <link rel="stylesheet" href="style.css">
    </head>
    <body>
      <h1>Привет!</h1>
      <p>Ты используешь: ${userAgent}.</p>
    </body>
  </html>`;

  switch (request.url) {
    case `/style.css`:
      response.writeHead(HTTP_SUCCESS_CODE, {
      'Content-Type': `text/css; charset=UTF-8`,
      });
  
      response.end(styles);
      break;
  
    case `/`:
      const userAgent = request.headers[`user-agent`];
      const responseText = getResponseText(userAgent);
  
      response.writeHead(HTTP_SUCCESS_CODE, {
      'Content-Type': `text/html; charset=UTF-8`,
      });
  
      response.end(responseText);
      break;
  
    default:
      response.writeHead(HTTP_NOT_FOUND_CODE, {
      'Content-Type': `text/plain; charset=UTF-8`,
      });
    response.end(`Упс, ничего не найдено :(`);
  }

  response.writeHead(HTTP_SUCCESS_CODE, {
    'Content-Type': `text/html; charset=UTF-8`,
    });


  response.end(responseText);
};

const port = 8000;
const httpServer = http.createServer(onClientConnect);

httpServer.listen(port, (err) => {
  if (err) {
    return console.error(`Ошибка при создании http-сервера.`, err);
  }

  return console.info(`Принимаю подключения на ${port}`);
});
