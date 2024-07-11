import express from "express";

import StarshipsService from "../services/starships.services.js";

export default class StarshipsController {
	static createStarships = async (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	): Promise<void> => {};

	static getStarships = async (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	): Promise<void> => {
		try {
			const { id, data, paginate } = req.body;

			if (id && !data) {
				const starship = (await StarshipsService.getStarshipById(id)) as {
					data: any;
				};
				res.status(200).json(starship.data);
			} else if (data && !id) {
				const starshipsFiltered = (await StarshipsService.getStarshipsFiltered(
					paginate,
					data
				)) as { pagination: any; data: any[] };
				res.status(200).json(starshipsFiltered.data);
			} else if (!id && !data) {
				let starships = (await StarshipsService.getStarships(paginate)) as {
					pagination: any;
					data: any;
				};
				res.status(200).json(starships.data);
			} else {
				res.status(500).json({ message: "Wrong body request" });
			}
		} catch (error: unknown) {
			next(error);
		}
	};
}
