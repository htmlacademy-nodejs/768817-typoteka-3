'use strict';

const {Router} = require(`express`);
const {concat, pipe, countBy, identity, isEmpty} = require(`ramda`);
const request = require(`request-promise-native`);

const {getUrl} = require(`../../utils`);
const {articlesList, search, BASE_URL_SERVICE} = require(`../../endPoints`);

const commonRouter = new Router();

commonRouter.get(`/`, async (req, res) => {
  const url = getUrl(`http://localhost:3000/`, articlesList);
  let categoriesList = [];
  let articles = [];
  let categories = {};
  try {
    articles = await request(url, {json: true});
    articles.map((item) => {
      categoriesList = concat(categoriesList, item.category);
    });
    categories = pipe(countBy(identity))(categoriesList);

    console.log(`categories`, categories);
    return res.render(`main`, {articles, categories});
  } catch (err) {
    console.error(`error`, err);
    return res.render(`main`, {articles, categories});
  }

});
commonRouter.get(`/login`, (req, res) => res.render(`login`));
commonRouter.get(`/register`, (req, res) => res.render(`sign-up`));
commonRouter.get(`/search`, async (req, res) => {
  if (isEmpty(req.query)) {
    return res.render(`search`, {articles: []});
  }

  try {
    const options = {
      uri: getUrl(BASE_URL_SERVICE, search),
      qs: req.query,
      json: true,
    };
    const articles = await request(options);
    return res.render(`search`, {articles});
  } catch (err) {
    console.error(`error`, err);
    return res.render(`search`, {articles: []});
  }
});

commonRouter.get(`/categories`, (req, res) => res.render(`all-categories`));

module.exports = commonRouter;
