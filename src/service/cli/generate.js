'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);

const {
  getRandomInt,
  shuffle,
} = require(`../../utils`);

const DEFAULT_AMOUNT = 1;
const FILE_NAME = `mocks.json`;
const MAX_OFFERS_COUNT = 1000;

const FILE_SETENCES_PATH = `./src/data/sentences.txt`;
const FILE_TITLES_PATH = `./src/data/titles.txt`;
const FILE_CATEGORIES_PATH = `./src/data/categories.txt`;

const generateOffers = (count, titles, sentences, categories) => (
  Array(count).fill({}).map(() => ({
    title: titles[getRandomInt(0, titles.length - 1)],
    createdDate: new Date(),
    announce: shuffle(sentences).slice(1, 5).join(` `),
    fullText: shuffle(sentences).join(` `),
    category: [categories[getRandomInt(0, categories.length - 1)]],
  }))
);

const readContent = async (path) => {
  try {
    const content = await fs.readFile(path, `utf8`);
    return content.split(`\n`);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

module.exports = {
  name: `--generate`,
  async run(args) {
    const [count] = args;
    if (count > MAX_OFFERS_COUNT) {
      console.error(chalk.red(`Не больше 1000 объявлений`));
      process.exit(1);
    }
    const countOffer = Number.parseInt(count, 10) || DEFAULT_AMOUNT;
    const titles = await readContent(FILE_TITLES_PATH);
    const sentences = await readContent(FILE_SETENCES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const content = JSON.stringify(generateOffers(countOffer, titles, sentences, categories));
    try {
      await fs.writeFile(FILE_NAME, content);
      console.log(chalk.green(`Operation success. File created.`));
      return process.exit(0);
    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
      return process.exit(1);
    }
  }
};
