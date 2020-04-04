'use strict';

const {Router} = require(`express`);
const commonRouter = new Router();

commonRouter.get(`/`, (req, res) => res.render(`main`));
commonRouter.get(`/login`, (req, res) => res.render(`login`));
commonRouter.get(`/register`, (req, res) => res.render(`sign-up`));
commonRouter.get(`/search`, (req, res) => res.render(`search`));
commonRouter.get(`/categories`, (req, res) => res.render(`all-categories`));

module.exports = commonRouter;
