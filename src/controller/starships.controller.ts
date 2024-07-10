import express from "express";
import axios, { AxiosResponse } from "axios";

import StarshipsService from "../services/starships.services";
import StarshipInterface from "../types/interfaces/starships.interface";

export default class StarshipsController {
	static createStarships = async (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	): Promise<void> => {
		try {
			let result: StarshipInterface[] = [];
			let nextPage: number | null = 1;
			while (nextPage) {
				const response: AxiosResponse<any> = await axios.get(
					`https://swapi.dev/api/starships/?page=${nextPage}`
				);

				const starships = response.data.results;
				for (const starship of starships) {
					const ship: StarshipInterface = {
						name: starship.name,
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
			const starshipsCreated = (await StarshipsService.createStarships(
				result
			)) as {
				status: number;
				data: any;
			};
			res.status(200).json(starshipsCreated);
		} catch (error: unknown) {
			next(error);
		}
	};

	static getStarships = async (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	): Promise<void> => {
		try {
			const starships = (await StarshipsService.getStarships()) as {
				status: number;
				data: StarshipInterface[];
			};
			res.status(starships.status).json(starships.data);
		} catch (error: unknown) {
			next(error);
		}
	};

	static getStarshipById = async (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	): Promise<void> => {
		try {
			const { id } = req.params;
			const starship = (await StarshipsService.getStarshipById(id)) as {
				data: any;
			};
			res.status(200).json(starship.data);
		} catch (error: unknown) {
			next(error);
		}
	};

	static getStarshipsFiltered = async (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	): Promise<void> => {
		try {
			const { data } = req.body;
			const starshipsFiltered = (await StarshipsService.getStarshipsFiltered(
				data
			)) as { status: number; data: StarshipInterface[] };
			res.status(starshipsFiltered.status).json(starshipsFiltered.data);
		} catch (error: unknown) {
			next(error);
		}
	};

	static async updateStarship(
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	): Promise<void> {
		try {
			const { id } = req.params;
			const { data } = req.body;
			const updatedStarship = await StarshipsService.updateStarship(id, data);

			res.status(200).json(updatedStarship);
		} catch (error: unknown) {
			next(error);
		}
	}

	static deleteStarships = async (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	): Promise<void> => {
		try {
			const deleted = (await StarshipsService.deleteStarships()) as {
				status: number;
				data: StarshipInterface[];
			};

			res.status(200).json(deleted.data);
		} catch (error: unknown) {
			next(error);
		}
	};
}
