import express from "express";
import axios, { AxiosResponse } from "axios";

import PeopleService from "../services/people.services.js";
import PersonInterface from "../types/interfaces/people.interface.js";

export default class PeopleController {
	static createPeople = async (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	): Promise<void> => {
		try {
			let result: PersonInterface[] = [];
			let nextPage: number | null = 1;
			while (nextPage) {
				const response: AxiosResponse<any> = await axios.get(
					`https://swapi.dev/api/people/?page=${nextPage}`
				);
				const people = response.data.results;
				for (const person of people) {
					const character: PersonInterface = {
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
			const characterCreated = (await PeopleService.createPeople(result)) as {
				data: any;
			};
			res.status(200).json(characterCreated);
		} catch (error: unknown) {
			next(error);
		}
	};

	static async getPeople(
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	): Promise<void> {
		try {
			const people = (await PeopleService.getPeople()) as { data: any };
			res.status(200).json(people.data);
		} catch (error: unknown) {
			next(error);
		}
	}

	static async getPeopleById(
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	): Promise<void> {
		try {
			const { id } = req.params;
			const planet = (await PeopleService.getPeopleById(id)) as { data: any };
			res.status(200).json(planet.data);
		} catch (error: unknown) {
			next(error);
		}
	}

	static async getPeopleFiltered(
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	): Promise<void> {
		try {
			const { data } = req.body;
			const filteredPeople = (await PeopleService.getPeopleFiltered(data)) as {
				data: any;
			};
			res.status(200).json(filteredPeople.data);
		} catch (error: unknown) {
			next(error);
		}
	}

	static async updatePeople(
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	): Promise<void> {
		try {
			const { id } = req.params;
			const { data } = req.body;
			const updatedCharacter = (await PeopleService.updatePeople(id, data)) as {
				data: any;
			};
			res.status(200).json(updatedCharacter.data);
		} catch (error: unknown) {
			next(error);
		}
	}

	static async deletePeople(
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	): Promise<void> {
		try {
			const deletedPeople = (await PeopleService.deletePeople()) as {
				data: any;
			};
			res.status(200).json(deletedPeople.data);
		} catch (error: unknown) {
			next(error);
		}
	}
}
