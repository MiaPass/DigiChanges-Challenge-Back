import { peopleDao } from "../daos/factory";
export default class PeopleService {
    static async createPeople(data) {
        return peopleDao.create(data);
    }
    static async getPeople() {
        return peopleDao.getAll();
    }
    static async getPeopleById(id) {
        return peopleDao.getById(id);
    }
    static async getPeopleFiltered(data) {
        return peopleDao.getFiltered(data);
    }
    static async updatePeople(id, data) {
        return peopleDao.update(id, data);
    }
    static async deletePeople() {
        return peopleDao.delete();
    }
}
