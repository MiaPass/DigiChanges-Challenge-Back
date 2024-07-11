import axios, { AxiosResponse } from "axios";

import { starshipsDao } from "../daos/factory.js";

export default class StarshipsService {
	static async createStarships(next): Promise<void> {
		try {
			let result: any = [];
			let nextPage: number | null = 1;
			while (nextPage) {
				const response: AxiosResponse<any> = await axios.get(
					`https://swapi.dev/api/starships/?page=${nextPage}`
				);

				const starships = response.data.results;
				for (const starship of starships) {
					const ship = {
						name: starship.name,
						category: "starships",
						starship_model: starship.model,
						features: {
							manufacturer: starship.manufacturer,
							cost_in_credits: starship.cost_in_credits,
							length: starship.length,
							max_atmosphering_speed: starship.max_atmosphering_speed,
							crew: starship.crew,
							passengers: starship.passengers,
							cargo_capacity: starship.cargo_capacity,
							consumables: starship.consumables,
							hyperdrive_rating: starship.hyperdrive_rating,
							class: starship.class,
						},
						pilots: starship.pilots,
						films: starship.films,
						url: starship.url,
					};

					result.push(ship);
				}

				nextPage = response.data.next && nextPage ? nextPage + 1 : null;
			}
			await starshipsDao.create(result);
			return;
		} catch (error: unknown) {
			next(error);
		}
	}

	static async getStarships(): Promise<object> {
		return starshipsDao.getAll();
	}

	static async getStarshipById(id: string): Promise<object> {
		return starshipsDao.getById(id);
	}

	static async getStarshipsFiltered(data: { query: string }): Promise<object> {
		return starshipsDao.getFiltered(data);
	}

	static async deleteStarships(next): Promise<void> {
		try {
			await starshipsDao.delete();
		} catch (error: unknown) {
			next(error);
		}
	}
}
