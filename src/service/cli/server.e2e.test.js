'use strict';

const request = require(`supertest`);
const {app} = require(`./server`);
const {run} = require(`./generate`);
const {getData} = require(`../../utils`);
const {HttpCodes} = require(`../../constants`);

let mocks = [];
describe(`describes server end-points`, () => {
  beforeAll(async (done) => {
    const preventExit = true;
    await run([1, preventExit]);
    mocks = await getData();
    done();
  });
  test(`GET /api/categories should return: 200 and Array`, async (done) => {
    const res = await request(app).get(`/api/categories/`);
    expect(res.statusCode).toBe(HttpCodes.OK);
    expect(res.body).toEqual(expect.arrayContaining([]));
    done();
  });

  test(`GET /api/search should return: 200 and Array`, async (done) => {
    const articleId = mocks[0].id;
    const res = await request(app).get(`/api/search`).query({id: articleId});
    expect(res.statusCode).toBe(HttpCodes.OK);
    expect(res.body).toEqual(expect.objectContaining({}));
    done();
  });
});
