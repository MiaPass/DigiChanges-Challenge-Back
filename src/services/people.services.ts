import { peopleDao } from "../daos/factory";

export default class PeopleService {
	static async createPeople(data: object): Promise<object> {
		return peopleDao.create(data);
	}

	static async getPeople(): Promise<object> {
		return peopleDao.getAll();
	}

	static async getPeopleById(id: string): Promise<object> {
		return peopleDao.getById(id);
	}

	static async getPeopleFiltered(data: { query: string }): Promise<object> {
		return peopleDao.getFiltered(data);
	}

	static async updatePeople(id: string, data: object): Promise<object> {
		return peopleDao.update(id, data);
	}

	static async deletePeople(): Promise<object> {
		return peopleDao.delete();
	}
}
