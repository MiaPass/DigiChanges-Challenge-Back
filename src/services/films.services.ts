import axios, { AxiosResponse } from "axios";

import { filmsDao } from "../daos/factory.js";

export default class FilmsService {
	static async createFilms(next): Promise<any> {
		try {
			let result: any = [];
			let nextPage: number | null = 1;
			while (nextPage) {
				const response: AxiosResponse<any> = await axios.get(
					`https://swapi.dev/api/films/?page=${nextPage}`
				);

				const films = response.data.results;
				for (const film of films) {
					const movie = {
						category: "films",
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
			await filmsDao.create(result);
			return;
		} catch (error: unknown) {
			next(error);
		}
	}

	static async getFilms(paginate): Promise<object> {
		return filmsDao.getAll(paginate);
	}

	static async getFilmById(id): Promise<object> {
		return filmsDao.getById(id);
	}

	static async getFilmsFiltered(paginate, field, value): Promise<object> {
		return filmsDao.getFiltered(paginate, field, value);
	}

	static async deleteFilms(next): Promise<void> {
		try {
			await filmsDao.delete();
			return;
		} catch (error: unknown) {
			next(error);
		}
	}
}
