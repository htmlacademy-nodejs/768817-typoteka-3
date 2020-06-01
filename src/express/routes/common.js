'use strict';

const {Router} = require(`express`);
const {concat, pipe, countBy, identity, isEmpty} = require(`ramda`);
const request = require(`request-promise-native`);

const {getUrl} = require(`../../utils`);
const {articlesList, search, BASE_URL_SERVICE} = require(`../../endPoints`);

const commonRouter = new Router();

commonRouter.get(`/`, async (req, res) => {
  const url = getUrl(`http://localhost:3000/`, articlesList);
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
commonRouter.get(`/search`, async (req, res) => {
  const qs = req.query;
  if (isEmpty(qs)) {
    return res.render(`search`, {articles: []});
  } else {
    const options = {
      uri: getUrl(BASE_URL_SERVICE, search),
      qs,
      json: true,
    };
    const articles = await request(options);
    return res.render(`search`, {articles});
  }
});

commonRouter.get(`/categories`, (req, res) => res.render(`all-categories`));

module.exports = commonRouter;
