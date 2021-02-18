'use strict';
const {nanoid} = require(`nanoid`);
const {Router} = require(`express`);
const multer = require(`multer`);
const path = require(`path`);

const request = require(`request-promise-native`);
const {getUrl} = require(`../../utils`);
const {articlesList, articleItem, BASE_URL_SERVICE} = require(`../../endPoints`);
const {HttpCodes} = require(`../../constants`);

const articlesRouter = new Router();

const UPLOAD_DIR = `../upload/img/`;
const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: uploadDirAbsolute,
  filename: (req, file, cb) => {
    const uniqueName = nanoid(10);
    const extension = file.originalname.split(`.`).pop();
    cb(null, `${uniqueName}.${extension}`);
  }
});
const upload = multer({storage});

articlesRouter.post(`/add`, upload.single(`avatar`), async (req, res) => {
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
    return res.status(HttpCodes.INTERNAL_SERVER_ERROR).json({message: `Something went wrong`});
  }
});
articlesRouter.get(`/:id`, (req, res) => res.render(`post`));

module.exports = articlesRouter;
