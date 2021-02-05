const generator = require('../index')
const json = require('./data/json.json')
const correct_schema = require('./data/correct_schema.json')
const chai = require('chai')
const expect = chai.expect

describe("check generate function", () => {
  it("should generate the schema", ()=> {
    expect(generator(json)).to.eql(correct_schema);
  })
  it("it shouldn't fail when there is an empty array", ()=> {
    generator([]);
  })
})
