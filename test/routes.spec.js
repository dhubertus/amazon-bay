process.env.NODE_ENV = "test";
const chai = require("chai");
const should = chai.should();
const chaiHttp = require("chai-http");
const server = require("../server.js");
const knex = require("../db/knex.js");

chai.use(chaiHttp);

describe('API Routes', () => {

  before((done) => {
    knex.migrate.latest()
      .then(() => {
        knex.seed.run();
      })
      .then(() => {
        done();
      });
  });

  it("should return 404 for route that doesnt exist", (done) => {
    chai.request(server)
      .get("/sad")
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });

  it("should return 200 when it hits /api/v1/inventory", (done) => {
    chai.request(server)
      .get("/api/v1/inventory")
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        done();
      });
  });

  it("should return 200 when receiving order history at /api/v1/history", (done) => {
    chai.request(server)
      .get("/api/v1/history")
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        done();
      });
  });

  it("should return 200 when creating an order at /api/v1/history", (done) => {
    chai.request(server)
      .post("/api/v1/history")
      .send({
        total: 3000
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        done();
      });
  });

  it("should return 422 when creating an order at /api/v1/history without including the proper body", (done) => {
    chai.request(server)
      .post("/api/v1/history")
      .send({
        null: null
      })
      .end((err, res) => {
        res.should.have.status(422);
        res.should.be.json;
        done();
      });
  });
});
