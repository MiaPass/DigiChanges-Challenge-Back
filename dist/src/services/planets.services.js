import { planetsDao } from "../daos/factory";
export default class PlanetsService {
    static async createPlanets(data) {
        return planetsDao.create(data);
    }
    static async getPlanets() {
        return planetsDao.getAll();
    }
    static async getPlanetById(id) {
        return planetsDao.getById(id);
    }
    static async getPlanetsFiltered(data) {
        return planetsDao.getFiltered(data);
    }
    static async updatePlanet(id, data) {
        return planetsDao.update(id, data);
    }
    static async deletePlanets() {
        return planetsDao.delete();
    }
}
