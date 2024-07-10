import { filmsDao } from "../daos/factory";

export default class FilmsService {
	static async createFilms(data: object): Promise<object> {
		return filmsDao.create(data);
	}

	static async getFilms(): Promise<object> {
		return filmsDao.getAll();
	}

	static async getFilmById(id: string): Promise<object> {
		return filmsDao.getById(id);
	}

	static async getFilmsFiltered(data: { query: string }): Promise<object> {
		return filmsDao.getFiltered(data);
	}

	static async updateFilm(id: string, data: object): Promise<object> {
		return filmsDao.update(id, data);
	}

	static async deleteFilms(): Promise<object> {
		return filmsDao.delete();
	}
}
