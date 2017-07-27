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
        res.body[0].should.have.property('id');
        res.body[0].should.have.property('title');
        res.body[0].should.have.property('description');
        res.body[0].should.have.property('link');
        res.body[0].should.have.property('price');
        res.should.have.status(200);
        res.should.be.json;
        done();
      });
  });

  it("should return 200 when receiving order history at /api/v1/history", (done) => {
    chai.request(server)
      .get("/api/v1/history")
      .end((err, res) => {
        res.body.length.should.equal(3);
        res.body[0].should.have.property('id');
        res.body[0].should.have.property('total');
        res.body[0].should.have.property('created_at');
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
        res.body.command.should.equal('INSERT');
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
        res.body.error.should.equal('There was an error inserting to history. Please check that you are including the proper body with the request!');
        res.should.have.status(422);
        res.should.be.json;
        done();
      });
  });
});
