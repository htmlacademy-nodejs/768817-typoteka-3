'use strict';

const chalk = require(`chalk`);

const getHelp = () => {
  const textHelp = `
  Программа запускает http-сервер и формирует файл с данными для API.
    
  Гайд:
  server <command>;
  Команды:
  --version:            выводит номер версии
  --help:               печатает этот текст
  --generate <count>    формирует файл mocks.json
  --server <port>       создает сервер
  `;

  console.log(chalk.gray(textHelp));
};

module.exports = {
  name: `--help`,
  run() {
    getHelp();
  }
};

