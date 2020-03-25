'use strict';

const {Router} = require(`express`);

const articlesRouter = new Router();

articlesRouter.get(`/category/:id`, (req, res) => res.send(`/category/:id`));
articlesRouter.get(`/add`, (req, res) => res.send(`/add`));
articlesRouter.get(`/edit/:id`, (req, res) => res.send(`/edit/:id`));
articlesRouter.get(`/:id`, (req, res) => res.send(`/:id`));

module.exports = articlesRouter;
