import express from "express";

import PlanetsService from "../services/planets.services.js";

export default class PlanetsController {
	static async getPlanets(
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	): Promise<void> {
		try {
			const { page } = req.query;
			const { id, data } = req.body;

			let paginate = { page: page };
			if (id && !data) {
				const planet = (await PlanetsService.getPlanetById(id)) as {
					data: any;
				};
				res.status(200).json(planet.data);
			} else if (data && !id) {
				const planetsFiltered = (await PlanetsService.getPlanetsFiltered(
					paginate,
					data
				)) as { pagination: any; data: any };
				res.status(200).json(planetsFiltered.data);
			} else if (!id && !data) {
				const planets = (await PlanetsService.getPlanets(paginate)) as {
					pagination: any;
					data: any;
				};
				res.status(200).json(planets.data);
			} else {
				res.status(500).json({ message: "Wrong body request" });
			}
		} catch (error: unknown) {
			next(error);
		}
	}
}
