import { filmsDao } from "../daos/factory";
export default class FilmsService {
    static async createFilms(data) {
        return filmsDao.create(data);
    }
    static async getFilms() {
        return filmsDao.getAll();
    }
    static async getFilmById(id) {
        return filmsDao.getById(id);
    }
    static async getFilmsFiltered(data) {
        return filmsDao.getFiltered(data);
    }
    static async updateFilm(id, data) {
        return filmsDao.update(id, data);
    }
    static async deleteFilms() {
        return filmsDao.delete();
    }
}
