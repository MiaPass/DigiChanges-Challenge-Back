import chai from "chai";
import { describe, it, before } from "mocha";
import config from "../src/config/config";
import MongoDbConnect from "../src/utils/dbConnect";
import PlanetManagerMongo from "../src/daos/mongo/managers/planets.manager";
const { test } = config.mongo;
const expect = chai.expect;
describe("Tests for planets", function () {
    let manager;
    before(async function () {
        const db = MongoDbConnect.create();
        db.init(test);
        manager = new PlanetManagerMongo();
    });
    it("It should return all the planets", async function () {
        const result = (await manager.getAll());
        expect(result).to.be.an("array");
        expect(result[0]).to.have.property("status");
        expect(result[0]).to.have.property("data");
    });
});
