'use strict';

const {Router} = require(`express`);
const {concat} = require(`ramda`);
const request = require(`request-promise-native`);

const {getUrl} = require(`../../utils`);
const {articlesList, BASE_URL_SERVICE} = require(`../../endPoints`);

const myRouter = new Router();

myRouter.get(`/`, async (req, res) => {
  let articles = [];
  try {
    articles = await request(getUrl(BASE_URL_SERVICE, articlesList), {json: true});
    return res.render(`my`, {articles});
  } catch (err) {
    console.error(`error`, err);
    return res.render(`my`, {articles});
  }
});

myRouter.get(`/comments`, async (req, res) => {
  let articles = [];
  let comments = [];

  try {
    const options = {
      qs: {size: 3},
      json: true
    };
    articles = await request(getUrl(BASE_URL_SERVICE, articlesList), options);
    articles.map((item) => {
      comments = concat(comments, item.comments);
    });
    return res.render(`comments`, {comments});
  } catch (err) {
    console.error(`error`, err);
    return res.render(`comments`, {comments});
  }
});

module.exports = myRouter;
