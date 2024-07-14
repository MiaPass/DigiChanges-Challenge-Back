import { peopleDao } from "../daos/factory.js";

import axios, { AxiosResponse } from "axios";

export default class PeopleService {
	static async createPeople(next): Promise<void> {
		try {
			let result: any = [];
			let nextPage: number | null = 1;
			while (nextPage) {
				const response: AxiosResponse<any> = await axios.get(
					`https://swapi.dev/api/people/?page=${nextPage}`
				);
				const people = response.data.results;
				for (const person of people) {
					const character = {
						name: person.name,
						category: "people",
						features: {
							height: person.height,
							mass: person.mass,
							hair_color: person.hair_color,
							skin_color: person.skin_color,
							eye_color: person.eye_color,
							birth_year: person.birth_year,
							gender: person.gender,
						},
						films: person.films,
						planet: person.homeworld,
						starships: person.starships,
						url: person.url,
					};

					result.push(character);
				}
				nextPage = response.data.next && nextPage ? nextPage + 1 : null;
			}
			await peopleDao.create(result);
			return;
		} catch (error: unknown) {
			next(error);
		}
	}

	static async getPeople(paginate): Promise<object> {
		return peopleDao.getAll(paginate);
	}

	static async getPeopleById(id: string): Promise<object> {
		return peopleDao.getById(id);
	}

	static async getPeopleFiltered(paginate, field, value): Promise<object> {
		return peopleDao.getFiltered(paginate, field, value);
	}

	static async deletePeople(next): Promise<void> {
		try {
			await peopleDao.delete();
			return;
		} catch (error: unknown) {
			next(error);
		}
	}
}
