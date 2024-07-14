import express from "express";

import PlanetsService from "../services/planets.services.js";

export default class PlanetsController {
	static async getPlanets(
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	): Promise<void> {
		try {
			const { page, field, value } = req.query;
			const { id } = req.params;
			const newValue =
				value !== undefined && typeof value === "string" && value.includes("_")
					? value.replace(/_/g, " ")
					: value !== undefined
					? value
					: null;
			let paginate = { page: Number(page) };
			if (id && !field && !newValue) {
				const planet = (await PlanetsService.getPlanetById(id)) as {
					data: any;
				};
				res.status(200).json(planet.data);
			} else if (!id && field && newValue) {
				const planetsFiltered = (await PlanetsService.getPlanetsFiltered(
					paginate,
					field,
					newValue
				)) as { data: any };
				res.status(200).json(planetsFiltered.data);
			} else if (!id && !field && !newValue) {
				const planets = (await PlanetsService.getPlanets(paginate)) as {
					data: any;
				};
				res.status(200).json(planets.data);
			}
		} catch (error: unknown) {
			next(error);
		}
	}
}
