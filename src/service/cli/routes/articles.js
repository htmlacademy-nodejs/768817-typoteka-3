'use strict';

const {Router} = require(`express`);
const {nanoid} = require(`nanoid`);
const {find, propEq, any, isNil} = require(`ramda`);
const {getMocks} = require(`../../../utils`);
const {HttpCodes, ID_LENGTH} = require(`../../../constants`);
const {OK, BAD_REQUEST} = HttpCodes;

const articlesRouter = new Router();

articlesRouter.get(`/`, async (req, res) => {
  try {
    const mocks = await getMocks();
    return res.status(OK).json(mocks);
  } catch (err) {
    return res.status(BAD_REQUEST).json([]);
  }
});

articlesRouter.get(`/:articleId`, async (req, res) => {
  try {
    const mocks = await getMocks();
    const {articleId} = req.params;
    const article = find(propEq(`id`, articleId))(mocks);
    return res.status(OK).json(article);
  } catch (err) {
    return res.status(BAD_REQUEST).json({});
  }
});

articlesRouter.post(`/`, async (req, res) => {
  try {
    const {title, announce, category, comments, fullText} = req.body;
    if (any(isNil)([title, announce, category])) {
      return res.status(BAD_REQUEST).json([]);
    }
    const mocks = await getMocks();
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
    return res.status(OK).json(newMocks);
  } catch (err) {
    return res.status(BAD_REQUEST).json([]);
  }
});

articlesRouter.put(`/:articleId`, async (req, res) => {
  try {
    const {title, announce, category, comments, fullText} = req.body;
    if (any(isNil)([title, announce, category])) {
      return res.status(BAD_REQUEST).json([]);
    }
    const mocks = await getMocks();
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
    return res.status(OK).json(newMocks);
  } catch (err) {
    return res.status(BAD_REQUEST).json({});
  }
});

articlesRouter.delete(`/:articleId`, async (req, res) => {
  try {
    const mocks = await getMocks();
    const {articleId} = req.params;
    const newMocks = mocks.filter((item) => item.id !== articleId);
    return res.status(OK).json(newMocks);
  } catch (err) {
    return res.status(BAD_REQUEST).json([]);
  }
});

articlesRouter.get(`/:articleId/comments`, async (req, res) => {
  try {
    const mocks = await getMocks();
    const {articleId} = req.params;
    const article = find(propEq(`id`, articleId))(mocks);
    const comments = article.comments || [];
    return res.status(OK).json(comments);
  } catch (err) {
    return res.status(BAD_REQUEST).json([]);
  }
});

articlesRouter.delete(`/:articleId/comments/:commentId`, async (req, res) => {
  try {
    const mocks = await getMocks();
    const {articleId, commentId} = req.params;
    const article = find(propEq(`id`, articleId))(mocks);
    let comments = article.comments ? article.comments.filter((item) => item.id !== commentId) : [];
    return res.status(OK).json(comments);
  } catch (err) {
    return res.status(BAD_REQUEST).json([]);
  }
});

articlesRouter.post(`/:articleId/comments`, async (req, res) => {
  try {
    if (!req.body || !req.body.text) {
      return res.status(BAD_REQUEST).json([]);
    }
    const mocks = await getMocks();
    const {articleId} = req.params;
    const article = find(propEq(`id`, articleId))(mocks);
    const comment = {
      id: nanoid(ID_LENGTH),
      text: req.body.text || ``,
    };
    const comments = article.comments ? article.comments.concat(comment) : [];
    return res.status(OK).json(comments);
  } catch (err) {
    return res.status(BAD_REQUEST).json([]);
  }
});

module.exports = articlesRouter;
