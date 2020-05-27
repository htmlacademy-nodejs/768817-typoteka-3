'use strict';

const {Router} = require(`express`);
const {concat} = require(`ramda`);
const request = require(`request-promise-native`);
const url = `http://localhost:3000/api/articles`;

const myRouter = new Router();

myRouter.get(`/`, async (req, res) => {
  const articles = await request(url, {json: true});
  res.render(`my`, {articles});
});
myRouter.get(`/comments`, async (req, res) => {
  const articles = await request(url, {json: true});
  let comments = [];
  articles.map((item) => {
    comments = concat(comments, item.comments);
  });
  console.log(`comments`, comments);
  res.render(`comments`, {comments});
});

module.exports = myRouter;
