'use strict';

const {Router} = require(`express`);
const express = require(`express`);
const request = require(`request-promise-native`);
const url = `http://localhost:3000/api/articles/`;

const articlesRouter = new Router();
articlesRouter.use(express.urlencoded({extended: false}));

articlesRouter.post(`/add`, (req, res) => {
  console.log(req.body);
});

articlesRouter.get(`/category/:id`, (req, res) => res.render(`articles-by-category`));
articlesRouter.get(`/add`, (req, res) => {
  console.log(req.body);
  res.render(`new-post`);
});
articlesRouter.get(`/edit/:id`, async (req, res) => {
  const id = req.params.id;
  const article = await request(`${url + id}`, {json: true});
  res.render(`post`, {article});
});
articlesRouter.get(`/:id`, (req, res) => res.render(`post`));

module.exports = articlesRouter;
