import config from "../config/config";
let filmsDao;
let peopleDao;
let planetsDao;
let starshipsDao;
const { persistence } = config.server;
switch (persistence) {
    case "MONGO":
        const FilmsManagerMongo = await import("./mongo/managers/films.manager");
        const PeopleManagerMongo = await import("./mongo/managers/people.manager");
        const PlanetsManagerMongo = await import("./mongo/managers/planets.manager");
        const StarshipsManagerMongo = await import("./mongo/managers/starships.manager");
        filmsDao = new FilmsManagerMongo.default();
        peopleDao = new PeopleManagerMongo.default();
        planetsDao = new PlanetsManagerMongo.default();
        starshipsDao = new StarshipsManagerMongo.default();
        break;
}
export { filmsDao, peopleDao, planetsDao, starshipsDao };
