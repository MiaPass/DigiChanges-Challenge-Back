import { starshipsDao } from "../daos/factory";

export default class StarshipsService {
	static async createStarships(data: object): Promise<object> {
		return starshipsDao.create(data);
	}

	static async getStarships(): Promise<object> {
		return starshipsDao.getAll();
	}

	static async getStarshipById(id: string): Promise<object> {
		return starshipsDao.getById(id);
	}

	static async getStarshipsFiltered(data: { query: string }): Promise<object> {
		return starshipsDao.getFiltered(data);
	}

	static async updateStarship(id: string, data: object): Promise<object> {
		return starshipsDao.update(id, data);
	}

	static async deleteStarships(): Promise<object> {
		return starshipsDao.delete();
	}
}
