'use strict';

const {Router} = require(`express`);
const {nanoid} = require(`nanoid`);
const {find, propEq, any, isNil, pathOr, slice} = require(`ramda`);

const {getData} = require(`../../../utils`);
const {HttpCodes, ID_LENGTH} = require(`../../../constants`);
const {getLogger} = require(`../../../logger`);

const articlesRouter = new Router();
const logger = getLogger();

articlesRouter.get(`/`, async (req, res) => {
  logger.info(`End request with status code ${res.statusCode}`);
  try {
    const mocks = await getData();
    const size = pathOr(null, [`query`, `size`], req);
    return size ? res.status(HttpCodes.OK).json(slice(0, size, mocks)) : res.status(HttpCodes.OK).json(mocks);
  } catch (err) {
    return res.status(HttpCodes.INTERNAL_SERVER_ERROR).json([]);
  }
});

articlesRouter.get(`/:articleId`, async (req, res) => {
  logger.info(`End request with status code ${res.statusCode}`);
  let article = {};
  try {
    const mocks = await getData();
    const {articleId} = req.params;
    article = find(propEq(`id`, articleId))(mocks);
    if (isNil(article)) {
      return res.status(HttpCodes.NOT_FOUND).json(article);
    }
    return res.status(HttpCodes.OK).json(article);
  } catch (err) {
    return res.status(HttpCodes.INTERNAL_SERVER_ERROR).json({});
  }
});

articlesRouter.post(`/`, async (req, res) => {
  logger.info(`End POST request with status code ${res.statusCode}`);
  try {
    const {title, announce, category, comments, fullText} = req.body;
    console.log(`req.body,`, req.body);

    if (any(isNil)([title, announce, category])) {
      return res.status(HttpCodes.BAD_REQUEST).json([]);
    }
    const mocks = await getData();
    const newArticle = {
      id: nanoid(ID_LENGTH),
      title,
      announce,
      category,
      createdDate: new Date(),
      comments: comments || [],
      fullText: fullText || ``,
    };
    const newMocks = mocks.concat(newArticle);
    return res.status(HttpCodes.OK).json(newMocks);
  } catch (err) {
    return res.status(HttpCodes.INTERNAL_SERVER_ERROR).json([]);
  }
});

articlesRouter.put(`/:articleId`, async (req, res) => {
  logger.info(`End request with status code ${res.statusCode}`);
  try {
    const {title, announce, category, comments, fullText} = req.body;
    if (any(isNil)([title, announce, category])) {
      return res.status(HttpCodes.BAD_REQUEST).json([]);
    }
    const mocks = await getData();
    const {articleId} = req.params;
    const article = find(propEq(`id`, articleId))(mocks);
    const newArticle = {
      ...article,
      title,
      category,
      announce,
      comments: comments || [],
      fullText: fullText || ``,
    };

    const newMocks = mocks.filter((item) => item.id !== newArticle.id).concat(newArticle);
    return res.status(HttpCodes.OK).json(newMocks);
  } catch (err) {
    return res.status(HttpCodes.BAD_REQUEST).json({});
  }
});

articlesRouter.delete(`/:articleId`, async (req, res) => {
  logger.info(`End request with status code ${res.statusCode}`);
  try {
    const mocks = await getData();
    const {articleId} = req.params;
    const article = find(propEq(`id`, articleId))(mocks);
    if (!article) {
      return res.status(HttpCodes.NOT_FOUND).json({message: `article not found by given id`});
    }
    const newMocks = mocks.filter((item) => item.id !== articleId);
    return res.status(HttpCodes.OK).json(newMocks);
  } catch (err) {
    return res.status(HttpCodes.BAD_REQUEST).json([]);
  }
});

articlesRouter.get(`/:articleId/comments`, async (req, res) => {
  logger.info(`End request with status code ${res.statusCode}`);
  try {
    const mocks = await getData();
    const {articleId} = req.params;
    const article = find(propEq(`id`, articleId))(mocks);
    if (!article) {
      return res.status(HttpCodes.NOT_FOUND).json({message: `article was not found by given id`});
    }
    const comments = article.comments || [];
    return res.status(HttpCodes.OK).json(comments);
  } catch (err) {
    return res.status(HttpCodes.BAD_REQUEST).json([]);
  }
});

articlesRouter.delete(`/:articleId/comments/:commentId`, async (req, res) => {
  logger.info(`End request with status code ${res.statusCode}`);
  try {
    const mocks = await getData();
    const {articleId, commentId} = req.params;
    const article = await find(propEq(`id`, articleId))(mocks);
    if (!article) {
      return res.status(HttpCodes.NOT_FOUND).json({message: `article was not found by given id`});
    }
    const comment = find(propEq(`id`, commentId))(article.comments);
    if (!comment) {
      return res.status(HttpCodes.NOT_FOUND).json({message: `comment was not found by given id`});
    }
    let comments = article.comments ? article.comments.filter((item) => item.id !== commentId) : [];
    return res.status(HttpCodes.OK).json(comments);
  } catch (err) {
    return res.status(HttpCodes.BAD_REQUEST).json([]);
  }
});

articlesRouter.post(`/:articleId/comments`, async (req, res) => {
  logger.info(`End request with status code ${res.statusCode}`);
  try {
    if (!req.body || !req.body.text) {
      return res.status(HttpCodes.BAD_REQUEST).json([]);
    }
    const mocks = await getData();
    const {articleId} = req.params;
    const article = find(propEq(`id`, articleId))(mocks);
    const comment = {
      id: nanoid(ID_LENGTH),
      text: req.body.text || ``,
    };
    const comments = article.comments ? article.comments.concat(comment) : [];
    return res.status(HttpCodes.OK).json(comments);
  } catch (err) {
    return res.status(HttpCodes.BAD_REQUEST).json([]);
  }
});

module.exports = articlesRouter;
