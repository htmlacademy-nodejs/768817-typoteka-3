'use strict';
const fs = require(`fs`).promises;
const {FILE_NAME_MOCKS} = require(`./constants`);

module.exports.getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

module.exports.shuffle = (someArray) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] = [someArray[randomPosition], someArray[i]];
  }

  return someArray;
};

module.exports.getData = async () => {
  const content = await fs.readFile(FILE_NAME_MOCKS);
  return JSON.parse(content);
};

module.exports.readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.split(`\n`);
  } catch (err) {
    return console.log(err);
  }
};

module.exports.getUrl = (baseUrl, endPoint = ``) => {
  const url = `${baseUrl}${endPoint}`;
  console.log(`url`, url);
  return url;
};
