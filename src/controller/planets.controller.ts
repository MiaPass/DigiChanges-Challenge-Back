import express from "express";
import axios, { AxiosResponse } from "axios";

import PlanetsService from "../services/planets.services.js";
import PlanetInterface from "../types/interfaces/planets.interface.js";

export default class PlanetsController {
	static createPlanet = async (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	): Promise<void> => {
		try {
			let result: PlanetInterface[] = [];
			let nextPage: number | null = 1;
			while (nextPage) {
				const response: AxiosResponse<any> = await axios.get(
					`https://swapi.dev/api/planets/?page=${nextPage}`
				);
				const planets = response.data.results;
				for (const planet of planets) {
					const land: PlanetInterface = {
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
			const planetCreated = (await PlanetsService.createPlanets(result)) as {
				data: any;
			};
			res.status(200).json(planetCreated);
		} catch (error: unknown) {
			next(error);
		}
	};

	static async getPlanets(
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	): Promise<void> {
		try {
			const planets = (await PlanetsService.getPlanets()) as { data: any };
			res.status(200).json(planets.data);
		} catch (error: unknown) {
			next(error);
		}
	}

	static async getPlanetById(
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	): Promise<void> {
		try {
			const { id } = req.params;
			const planet = (await PlanetsService.getPlanetById(id)) as { data: any };
			res.status(200).json(planet.data);
		} catch (error: unknown) {
			next(error);
		}
	}

	static async getPlanetsFiltered(
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	): Promise<void> {
		try {
			const { data } = req.body;
			const planets = (await PlanetsService.getPlanetsFiltered(data)) as {
				data: any;
			};
			res.status(200).json(planets.data);
		} catch (error: unknown) {
			next(error);
		}
	}

	static async updatePlanet(
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	): Promise<void> {
		try {
			const { id } = req.params;
			const { data } = req.body;
			const updatedPlanet = (await PlanetsService.updatePlanet(id, data)) as {
				data: any;
			};
			res.status(200).json(updatedPlanet.data);
		} catch (error: unknown) {
			next(error);
		}
	}

	static async deletePlanets(
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	): Promise<void> {
		try {
			const deletedPlanets = (await PlanetsService.deletePlanets()) as {
				data: any;
			};
			res.status(200).json(deletedPlanets.data);
		} catch (error: unknown) {
			next(error);
		}
	}
}
