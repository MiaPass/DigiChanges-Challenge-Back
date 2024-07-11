import { planetsDao } from "../daos/factory.js";

import axios, { AxiosResponse } from "axios";

export default class PlanetsService {
	static async createPlanets(next): Promise<void> {
		try {
			let result: any = [];
			let nextPage: number | null = 1;
			while (nextPage) {
				const response: AxiosResponse<any> = await axios.get(
					`https://swapi.dev/api/planets/?page=${nextPage}`
				);
				const planets = response.data.results;
				for (const planet of planets) {
					const land = {
						name: planet.name,
						category: "planets",
						features: {
							rotation_period: planet.rotation_period,
							orbital_period: planet.orbital_period,
							diameter: planet.diameter,
							climate: planet.climate,
							gravity: planet.gravity,
							terrain: planet.terrain,
							surface_water: planet.surface_water,
							population: planet.population,
						},
						films: planet.films,
						url: planet.url,
					};

					result.push(land);
				}
				nextPage = response.data.next && nextPage ? nextPage + 1 : null;
			}
			await planetsDao.create(result);
			return;
		} catch (error: unknown) {
			next(error);
		}
	}

	static async getPlanets(paginate): Promise<object> {
		return planetsDao.getAll(paginate);
	}

	static async getPlanetById(id: string): Promise<object> {
		return planetsDao.getById(id);
	}

	static async getPlanetsFiltered(
		paginate,
		data: { query: string }
	): Promise<object> {
		return planetsDao.getFiltered(paginate, data);
	}

	static async deletePlanets(next): Promise<object> {
		return planetsDao.delete();
	}
}
