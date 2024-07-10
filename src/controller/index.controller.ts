import express from "express";

import FilmsService from "../services/films.services.js";
import PeopleService from "../services/people.services.js";
import PlanetsService from "../services/planets.services.js";
import StarshipsService from "../services/starships.services.js";

export default class Indexcontroller {
	static getAll = async (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) => {
		try {
			const result: [] = [];
			const films = (await FilmsService.getFilms()) as { data: [] };
			const people = (await PeopleService.getPeople()) as { data: [] };
			const planets = (await PlanetsService.getPlanets()) as { data: [] };
			const starships = (await StarshipsService.getStarships()) as {
				data: [];
			};
			result.push(
				...films.data,
				...people.data,
				...planets.data,
				...starships.data
			);
			res.status(200).json(result);
		} catch (error: unknown) {
			next(error);
		}
	};
}
