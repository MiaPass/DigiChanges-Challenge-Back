import { starshipsDao } from "../daos/factory";
export default class StarshipsService {
    static async createStarships(data) {
        return starshipsDao.create(data);
    }
    static async getStarships() {
        return starshipsDao.getAll();
    }
    static async getStarshipById(id) {
        return starshipsDao.getById(id);
    }
    static async getStarshipsFiltered(data) {
        return starshipsDao.getFiltered(data);
    }
    static async updateStarship(id, data) {
        return starshipsDao.update(id, data);
    }
    static async deleteStarships() {
        return starshipsDao.delete();
    }
}
