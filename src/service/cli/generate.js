'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {nanoid} = require(`nanoid`);

const {getRandomInt, shuffle} = require(`../../utils`);
const {
  ID_LENGTH,
  FILE_NAME_MOCKS,
  FILE_TITLES_PATH,
  FILE_CATEGORIES_PATH,
  FILE_SETENCES_PATH,
  FILE_COMMENTS_PATH,
} = require(`../../constants`);

const DEFAULT_AMOUNT = 1;
const MAX_OFFERS_COUNT = 1000;


const getComment = (comments) => {
  return shuffle(comments).join(` `);
};

const generateOffers = (count, titles, sentences, categories, comments) => (
  Array(count).fill({}).map(() => ({
    id: nanoid(ID_LENGTH),
    title: titles[getRandomInt(0, titles.length - 1)],
    createdDate: new Date(),
    announce: shuffle(sentences).slice(1, 5).join(` `),
    fullText: shuffle(sentences).join(` `),
    category: [categories[getRandomInt(0, categories.length - 1)]],
    comments: Array(getRandomInt(0, 3)).fill({}).map(() => ({id: nanoid(ID_LENGTH), text: getComment(comments)}))
  }))
);

const readContent = async (path) => {
  try {
    const content = await fs.readFile(path, `utf8`);
    return content.split(`\n`);
  } catch (err) {
    return [];
  }
};

module.exports = {
  name: `--generate`,
  async run(args) {
    const [count, preventExit] = args;
    if (count > MAX_OFFERS_COUNT) {
      console.error(chalk.red(`Не больше 1000 объявлений`));
      process.exit(1);
    }
    const countOffer = Number.parseInt(count, 10) || DEFAULT_AMOUNT;
    const titles = await readContent(FILE_TITLES_PATH);
    const sentences = await readContent(FILE_SETENCES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const comments = await readContent(FILE_COMMENTS_PATH);
    const content = JSON.stringify(generateOffers(countOffer, titles, sentences, categories, comments));
    try {
      await fs.writeFile(FILE_NAME_MOCKS, content);
      console.log(chalk.green(`Operation success. File created.`));
      return !preventExit && process.exit(0);
    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
      return process.exit(1);
    }
  }
};
