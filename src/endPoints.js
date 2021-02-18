'use strict';

const BASE_URL_EXPRESS = `http://localhost:8080/`;
const BASE_URL_SERVICE = `http://localhost:3000/`;

// SERVICE
const articlesList = `api/articles`;
const articleItem = (articleId) => `api/articles/${articleId}`;
const search = `api/search`;

module.exports = {
  articlesList,
  articleItem,
  search,
  BASE_URL_SERVICE,
  BASE_URL_EXPRESS
};
