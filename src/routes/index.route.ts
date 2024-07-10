import express, { Router } from "express";

import filmsRouter from "./films.route.js";
import peopleRouter from "./people.route.js";
import planetsRouter from "./planets.route.js";
import starshipsRouter from "./starships.route.js";

import FilmsService from "../services/films.services.js";
import PeopleService from "../services/people.services.js";
import PlanetsService from "../services/planets.services.js";
import StarshipsService from "../services/starships.services.js";

const router = Router();

router.use("/films", filmsRouter);
router.use("/people", peopleRouter);
router.use("/planets", planetsRouter);
router.use("/starships", starshipsRouter);

router.get(
	"/all",
	async (
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
	}
);

export default router;
