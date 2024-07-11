// import { expect } from "chai";
// import { describe, it, before } from "node:test";
// import MongoDbConnect from "../src/utils/dbConnect";
// import PlanetManagerMongo from "../src/daos/mongo/managers/planets.manager";
// import config from "../src/config/config";
// import "../src/daos/mongo/models/planets.model";
// import "../src/daos/mongo/models/films.model";

// let test = config.mongo.url;

// describe("Tests for planets", function () {
// 	let manager: PlanetManagerMongo;

// 	before(async function () {
// 		const db = MongoDbConnect.create();
// 		await db.init(test);
// 		manager = new PlanetManagerMongo();
// 	});

// 	it("It should return all the planets", async function () {
// 		const result = (await manager.getAll()) as { status: number; data: any[] };
// 		expect(result.status).to.equal(200);
// 		expect(result.data).to.be.an("array");
// 		expect(result.data.length).to.be.greaterThan(0);
// 		expect(result.data[0]).to.have.property("name");
// 		expect(result.data[0]).to.have.property("films");
// 	});

// 	it("Should return a specific planet by ID", async function () {
// 		const allPlanets = (await manager.getAll()) as {
// 			status: number;
// 			data: any[];
// 		};
// 		const planetId = allPlanets.data[0]._id.toString();

// 		const result = (await manager.getById(planetId)) as {
// 			status: number;
// 			data: any;
// 		};
// 		expect(result.status).to.equal(200);
// 		expect(result.data).to.be.an("object");
// 		expect(result.data._id.toString()).to.equal(planetId);
// 	});

// 	it("Should create a new planet", async function () {
// 		const newPlanet = {
// 			name: "New Test Planet",
// 			category: "gas giant",
// 			features: {
// 				rotation_period: "10",
// 				orbital_period: "5000",
// 				diameter: "140000",
// 				climate: "temperate",
// 				gravity: "1.1 standard",
// 				terrain: "gas giant",
// 				surface_water: "0",
// 				population: "unknown",
// 			},
// 			films: ["http://example.com/api/films/2/"],
// 			url: "http://example.com/api/planets/2/",
// 		};

// 		const result = (await manager.create([newPlanet])) as {
// 			status: number;
// 			data: any[];
// 		};
// 		expect(result.status).to.equal(200);
// 		expect(result.data).to.be.an("array");
// 		expect(result.data[0]).to.include({ name: "New Test Planet" });
// 	});
// });
