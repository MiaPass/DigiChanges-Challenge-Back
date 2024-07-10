import chai from "chai";
import { describe, it, before } from "mocha";
import config from "../src/config/config";
import MongoDbConnect from "../src/utils/dbConnect";
import PlanetManagerMongo from "../src/daos/mongo/managers/planets.manager";

const { expect } = chai;

const { test }: { test: string } = config.mongo;
describe("Tests for planets", function () {
	let manager: PlanetManagerMongo;

	before(async function () {
		const db = MongoDbConnect.create();
		db.init(test);
		manager = new PlanetManagerMongo();
	});

	it("It should return all the planets", async function () {
		const result = (await manager.getAll()) as Array<{
			status: string;
			data: any;
		}>;
		expect(result).to.be.an("array");
		expect(result[0]).to.have.property("status");
		expect(result[0]).to.have.property("data");
	});
});
