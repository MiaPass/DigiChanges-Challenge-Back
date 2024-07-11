import express from "express";

import PlanetsService from "../services/planets.services.js";

export default class PlanetsController {
	static async getPlanets(
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	): Promise<void> {
		try {
			let result: any = null;
			const { id, data } = req.body;
			if (id && !data) {
				const planet = (await PlanetsService.getPlanetById(id)) as {
					data: any;
				};
				res.status(200).json(planet.data);
			} else if (data && !id) {
				const planetsFiltered = (await PlanetsService.getPlanetsFiltered(
					data
				)) as {
					data: any;
				};
				res.status(200).json(planetsFiltered.data);
			} else if (!id && !data) {
				const planets = (await PlanetsService.getPlanets()) as { data: any };
				res.status(200).json(planets.data);
			} else {
				res.status(500).json({ message: "Wrong body request" });
			}
		} catch (error: unknown) {
			next(error);
		}
	}
}
