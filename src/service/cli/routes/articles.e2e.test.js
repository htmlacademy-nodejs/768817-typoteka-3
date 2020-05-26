'use strict';
const request = require(`supertest`);

const {app} = require(`../server`);
const {run} = require(`../generate`);
const {pathOr, isEmpty} = require(`ramda`);
const {getData} = require(`../../../utils`);
const {HttpCodes} = require(`../../../constants`);

let mocks = [];
describe(`describes articles router end-points`, () => {
  beforeAll(async (done) => {
    const preventExit = true;
    await run([1, preventExit]);
    mocks = await getData();
    done();
  });

  test(`GET /api/articles/ should return: 200 and Array of Objects`, async (done) => {
    const res = await request(app).get(`/api/articles/`);
    expect(res.statusCode).toBe(HttpCodes.OK);
    expect(res.body).toEqual(expect.arrayContaining([expect.objectContaining({})]));
    done();
  });

  test(`GET /api/articles/:articleId should return 200 and Object`, async (done) => {
    const articleId = mocks[0].id;
    const res = await request(app).get(`/api/articles/${articleId}`);
    expect(res.statusCode).toBe(HttpCodes.OK);
    expect(res.body).toEqual(expect.objectContaining({}));
    done();
  });

  test(`GET /api/articles/:articleId should return 404 and {}`, async (done) => {
    const articleId = 1234565;
    const res = await request(app).get(`/api/articles/${articleId}`);
    expect(res.statusCode).toBe(HttpCodes.NOT_FOUND);
    expect(res.body).toEqual({});
    done();
  });

  test(`POST /api/articles/ should return: 200 and Array of Objects`, async (done) => {
    const res = await request(app)
      .post(`/api/articles/`)
      .send({title: `aaa`, announce: `bbb`, category: [`derevja`]});
    expect(res.statusCode).toBe(HttpCodes.OK);
    expect(res.body).toEqual(expect.arrayContaining([expect.objectContaining({})]));
    done();
  });

  test(`POST /api/articles/ should return: 400 and []`, async (done) => {
    const res = await request(app)
      .post(`/api/articles/`)
      .send({announce: `bbb`, category: [`derevja`]});
    expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    expect(res.body).toEqual([]);
    done();
  });

  test(`PUT /api/articles/:articleId should return: 200 and Array of Objects`, async (done) => {
    const articleId = mocks[0].id;
    const res = await request(app)
      .put(`/api/articles/${articleId}`)
      .send({title: `aaa`, announce: `bbb`, category: [`derevja`]});
    expect(res.statusCode).toBe(HttpCodes.OK);
    expect(res.body).toEqual(expect.arrayContaining([]));
    done();
  });

  test(`PUT /api/articles/:articleId should return: 400`, async (done) => {
    const articleId = mocks[0].id;
    const res = await request(app)
      .put(`/api/articles/${articleId}`)
      .send({announce: `bbb`, category: [`derevja`]});
    expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    done();
  });

  test(`DELETE /api/articles/:articleId should return: 200 and Array of Objects`, async (done) => {
    const articleId = mocks[0].id;
    const res = await request(app).delete(`/api/articles/${articleId}`);
    expect(res.statusCode).toBe(HttpCodes.OK);
    expect(res.body).toEqual(expect.arrayContaining([]));
    done();
  });

  test(`DELETE /api/articles/:articleId should return: 404`, async (done) => {
    const articleId = 123465;
    const res = await request(app).delete(`/api/articles/${articleId}`);
    expect(res.statusCode).toBe(HttpCodes.NOT_FOUND);
    expect(res.body).toEqual(expect.arrayContaining([]));
    done();
  });

  test(`GET /api/articles/:articleId/comments should return 200 and Array`, async (done) => {
    const articleId = mocks[0].id;
    const res = await request(app).get(`/api/articles/${articleId}/comments`);
    expect(res.statusCode).toBe(HttpCodes.OK);
    expect(res.body).toEqual(expect.arrayContaining([]));
    done();
  });

  test(`GET /api/articles/:articleId/comments should return 404`, async (done) => {
    const articleId = 123456;
    const res = await request(app).get(`/api/articles/${articleId}/comments`);
    expect(res.statusCode).toBe(HttpCodes.NOT_FOUND);
    done();
  });

  test(`DELETE /api/articles/:articleId/comments/:commentId should return: 200 and Array of Objects`, async (done) => {
    const articleId = mocks[0].id;
    const comments = mocks[0].comments;
    const commentId = pathOr(null, [0, `comments`, 0, `id`], mocks);
    const res = await request(app).delete(`/api/articles/${articleId}/comments/${commentId}`);
    if (isEmpty(comments)) {
      expect(res.statusCode).toBe(HttpCodes.NOT_FOUND);
    } else {
      expect(res.statusCode).toBe(HttpCodes.OK);
      expect(res.body).toEqual(expect.arrayContaining([]));
    }
    done();
  });

  test(`DELETE /api/articles/:articleId/comments/:commentId should return: 404`, async (done) => {
    const articleId = 123456;
    const commentId = pathOr(null, [0, `comments`, 0, `id`], mocks);
    const res = await request(app).delete(`/api/articles/${articleId}/comments/${commentId}`);
    expect(res.statusCode).toBe(HttpCodes.NOT_FOUND);
    expect(res.body).toEqual(expect.arrayContaining([]));
    done();
  });

  test(`DELETE /api/articles/:articleId/comments/:commentId should return: 404`, async (done) => {
    const articleId = mocks[0].id;
    const commentId = 321123;
    const res = await request(app).delete(`/api/articles/${articleId}/comments/${commentId}`);
    expect(res.statusCode).toBe(HttpCodes.NOT_FOUND);
    done();
  });

  test(`POST /api/articles/:articleId/comments should return: 200 and Array of Objects`, async (done) => {
    const articleId = mocks[0].id;
    const res = await request(app)
      .post(`/api/articles/${articleId}/comments`)
      .send({text: `aaa`});
    expect(res.statusCode).toBe(HttpCodes.OK);
    expect(res.body).toEqual(expect.arrayContaining([]));
    done();
  });

  test(`POST /api/articles/:articleId/comments should return: 400`, async (done) => {
    const articleId = mocks[0].id;
    const res = await request(app)
      .post(`/api/articles/${articleId}/comments`)
      .send({});
    expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    done();
  });
});

