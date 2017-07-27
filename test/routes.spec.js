// process.env.NODE_ENV = "test";
const chai = require("chai");
const should = chai.should();
const chaiHttp = require("chai-http");
const server = require("../server.js");
const knex = require("../db/knex.js");

chai.use(chaiHttp);
