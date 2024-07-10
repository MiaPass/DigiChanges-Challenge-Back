import config from "../config/config.js";

import StarWars from "../types/interfaces/sw.interface.js";

let filmsDao: StarWars;
let peopleDao: StarWars;
let planetsDao: StarWars;
let starshipsDao: StarWars;

const { persistence } = config.server;

switch (persistence) {
	case "MONGO":
		const FilmsManagerMongo = await import("./mongo/managers/films.manager.js");
		const PeopleManagerMongo = await import(
			"./mongo/managers/people.manager.js"
		);
		const PlanetsManagerMongo = await import(
			"./mongo/managers/planets.manager.js"
		);
		const StarshipsManagerMongo = await import(
			"./mongo/managers/starships.manager.js"
		);

		filmsDao = new FilmsManagerMongo.default();
		peopleDao = new PeopleManagerMongo.default();
		planetsDao = new PlanetsManagerMongo.default();
		starshipsDao = new StarshipsManagerMongo.default();

		break;
}

export { filmsDao, peopleDao, planetsDao, starshipsDao };
