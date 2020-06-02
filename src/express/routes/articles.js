'use strict';

const {Router} = require(`express`);
const multer = require(`multer`);
const path = require(`path`);

const request = require(`request-promise-native`);
const {getUrl} = require(`../../utils`);
const {articlesList, articleItem, BASE_URL_SERVICE} = require(`../../endPoints`);

const articlesRouter = new Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, `./avatars`);
  },
  filename(req, file, cb) {
    cb(null, file.fieldname + `-` + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({storage});

articlesRouter.post(`/add`, upload.any(), async (req, res) => {
  try {
    const {categories} = req.body;
    const body = {
      ...req.body,
      category: Object.keys(categories),
      announce: ``,
    };
    const options = {
      method: `POST`,
      uri: getUrl(BASE_URL_SERVICE, articlesList),
      body,
      json: true
    };
    await request(options);
    return res.redirect(`/my`);
  } catch (err) {
    return res.redirect(`back`);
  }
});

articlesRouter.get(`/category/:id`, (req, res) => res.render(`articles-by-category`));
articlesRouter.get(`/add`, (req, res) => {
  res.render(`new-post`);
});
articlesRouter.get(`/edit/:id`, async (req, res) => {
  let article = {};
  try {
    const id = req.params.id;
    article = await request(getUrl(BASE_URL_SERVICE, articleItem(id)), {json: true});
    return res.render(`post`, {article});
  } catch (err) {
    return res.render(`post`, {article});
  }
});
articlesRouter.get(`/:id`, (req, res) => res.render(`post`));

module.exports = articlesRouter;
