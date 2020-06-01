'use strict';

const {Router} = require(`express`);
const {concat} = require(`ramda`);
const request = require(`request-promise-native`);

const {getUrl} = require(`../../utils`);
const {articlesList, BASE_URL_SERVICE} = require(`../../endPoints`);

const myRouter = new Router();

myRouter.get(`/`, async (req, res) => {
  const articles = await request(getUrl(BASE_URL_SERVICE, articlesList), {json: true});
  res.render(`my`, {articles});
});
myRouter.get(`/comments`, async (req, res) => {
  const articles = await request(getUrl(BASE_URL_SERVICE, articlesList), {json: true});
  let comments = [];
  articles.map((item) => {
    comments = concat(comments, item.comments);
  });
  console.log(`comments`, comments);
  res.render(`comments`, {comments});
});

module.exports = myRouter;
