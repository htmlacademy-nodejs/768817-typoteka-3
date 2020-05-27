'use strict';

const {Router} = require(`express`);
const {concat, pipe, countBy, identity} = require(`ramda`);
const request = require(`request-promise-native`);
const url = `http://localhost:3000/api/articles`;

const commonRouter = new Router();

commonRouter.get(`/`, async (req, res) => {
  const articles = await request(url, {json: true});
  let categoriesList = [];
  articles.map((item) => {
    categoriesList = concat(categoriesList, item.category);
  });
  const categories = pipe(countBy(identity))(categoriesList);

  console.log(`categories`, categories);
  return res.render(`main`, {articles, categories});
});
commonRouter.get(`/login`, (req, res) => res.render(`login`));
commonRouter.get(`/register`, (req, res) => res.render(`sign-up`));
commonRouter.get(`/search`, (req, res) => res.render(`search`));
commonRouter.get(`/categories`, (req, res) => res.render(`all-categories`));

module.exports = commonRouter;
