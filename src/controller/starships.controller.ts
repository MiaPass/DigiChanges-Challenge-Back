import express from "express";

import StarshipsService from "../services/starships.services.js";

export default class StarshipsController {
	static getStarships = async (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	): Promise<void> => {
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
				const starship = (await StarshipsService.getStarshipById(id)) as {
					data: any;
				};
				res.status(200).json(starship.data);
			} else if (!id && field && newValue) {
				const starshipsFiltered = (await StarshipsService.getStarshipsFiltered(
					paginate,
					field,
					newValue
				)) as { data: any[] };
				res.status(200).json(starshipsFiltered.data);
			} else if (!id && !field && !newValue) {
				let starships = (await StarshipsService.getStarships(paginate)) as {
					data: any;
				};
				res.status(200).json(starships.data);
			}
		} catch (error: unknown) {
			next(error);
		}
	};
}
