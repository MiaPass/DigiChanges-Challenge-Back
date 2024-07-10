import express from "express";
import axios, { AxiosResponse } from "axios";

import FilmsService from "../services/films.services";
import FilmInterface from "../types/interfaces/films.interface";

export default class FilmsController {
	static createFilms = async (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	): Promise<any> => {
		try {
			let result: FilmInterface[] = [];
			let nextPage: number | null = 1;
			while (nextPage) {
				const response: AxiosResponse<any> = await axios.get(
					`https://swapi.dev/api/films/?page=${nextPage}`
				);

				const films = response.data.results;
				for (const film of films) {
					const movie: FilmInterface = {
						name: film.title,
						episode: film.episode_id,
						features: {
							director: film.director,
							producer: film.producer,
							release_date: film.release_date,
						},
						characters: film.characters,
						planets: film.planets,
						starships: film.starships,
						url: film.url,
					};
					result.push(movie);
				}
				nextPage = response.data.next && nextPage ? nextPage + 1 : null;
			}
			const filmsCreated = (await FilmsService.createFilms(result)) as {
				data: any;
			};
			res.status(200).json(filmsCreated);
		} catch (error: unknown) {
			next(error);
		}
	};

	static async getFilms(
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	): Promise<void> {
		try {
			const films = (await FilmsService.getFilms()) as {
				data: any;
			};
			res.status(200).json(films.data);
		} catch (error: unknown) {
			next(error);
		}
	}

	static async getFilmById(
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	): Promise<void> {
		try {
			const { id } = req.params;
			const film = (await FilmsService.getFilmById(id)) as {
				data: any;
			};
			res.status(200).json(film.data);
		} catch (error: unknown) {
			next(error);
		}
	}

	static async getFilmsFiltered(
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	): Promise<void> {
		try {
			const { data } = req.body;
			const filteredFilms = (await FilmsService.getFilmsFiltered(data)) as {
				data: any;
			};
			res.status(200).json(filteredFilms.data);
		} catch (error: unknown) {
			next(error);
		}
	}

	static async updateFilm(
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	): Promise<void> {
		try {
			const { id } = req.params;
			const { data } = req.body;
			const updatedFilm = (await FilmsService.updateFilm(id, data)) as {
				data: any;
			};
			res.status(200).json(updatedFilm.data);
		} catch (error: unknown) {
			next(error);
		}
	}

	static async deleteFilms(
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	): Promise<void> {
		try {
			const deletedFilms = (await FilmsService.deleteFilms()) as { data: any };
			res.status(200).json(deletedFilms.data);
		} catch (error: unknown) {
			next(error);
		}
	}
}
