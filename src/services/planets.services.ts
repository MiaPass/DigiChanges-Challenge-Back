import { planetsDao } from "../daos/factory.js";

export default class PlanetsService {
	static async createPlanets(data: object): Promise<object> {
		return planetsDao.create(data);
	}

	static async getPlanets(): Promise<object> {
		return planetsDao.getAll();
	}

	static async getPlanetById(id: string): Promise<object> {
		return planetsDao.getById(id);
	}

	static async getPlanetsFiltered(data: { query: string }): Promise<object> {
		return planetsDao.getFiltered(data);
	}

	static async updatePlanet(id: string, data: object): Promise<object> {
		return planetsDao.update(id, data);
	}

	static async deletePlanets(): Promise<object> {
		return planetsDao.delete();
	}
}
