import express from "express";

import FilmsService from "../services/films.services.js";

export default class FilmsController {
	static async getFilms(
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	): Promise<void> {
		try {
			const { id, data, paginate } = req.body;

			if (id && !data) {
				const film = (await FilmsService.getFilmById(id)) as {
					data: any;
				};
				res.status(200).json(film.data);
			} else if (data && !id) {
				const filmsFiltered = (await FilmsService.getFilmsFiltered(
					paginate,
					data
				)) as {
					data: any;
					pagination: any;
				};

				res.status(200).json(filmsFiltered.data);
			} else if (!id && !data) {
				const films = (await FilmsService.getFilms(paginate)) as {
					data: any;
					pagination: any;
				};
				res.status(200).json([films.data, films.pagination]);
			} else {
				res.status(500).json({ message: "Wrong body request" });
			}
		} catch (error: unknown) {
			next(error);
		}
	}
}
