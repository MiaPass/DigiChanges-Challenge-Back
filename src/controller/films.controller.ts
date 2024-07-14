import express from "express";

import FilmsService from "../services/films.services.js";

export default class FilmsController {
	static async getFilms(
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
				const film = (await FilmsService.getFilmById(id)) as {
					data: any;
				};
				res.status(200).json(film.data);
			} else if (field && newValue && !id) {
				const filmsFiltered = (await FilmsService.getFilmsFiltered(
					paginate,
					field,
					newValue
				)) as {
					data: any;
				};

				res.status(200).json(filmsFiltered.data);
			} else if (!id && !field && !newValue) {
				const films = (await FilmsService.getFilms(paginate)) as {
					data: any;
				};
				res.status(200).json(films.data);
			}
		} catch (error: unknown) {
			next(error);
		}
	}
}
