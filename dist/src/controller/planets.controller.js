var _a;
import axios from "axios";
import PlanetsService from "../services/planets.services";
class PlanetsController {
    static async getPlanets(req, res, next) {
        try {
            const planets = (await PlanetsService.getPlanets());
            res.status(200).json(planets.data);
        }
        catch (error) {
            next(error);
        }
    }
    static async getPlanetById(req, res, next) {
        try {
            const { id } = req.params;
            const planet = (await PlanetsService.getPlanetById(id));
            res.status(200).json(planet.data);
        }
        catch (error) {
            next(error);
        }
    }
    static async getPlanetsFiltered(req, res, data, next) {
        try {
            const { data } = req.body;
            const planets = (await PlanetsService.getPlanetsFiltered(data));
            res.status(200).json(planets.data);
        }
        catch (error) {
            next(error);
        }
    }
    static async updatePlanet(req, res, id, data, next) {
        try {
            const { id } = req.params;
            const { data } = req.body;
            const updatedPlanet = (await PlanetsService.updatePlanet(id, data));
            res.status(200).json(updatedPlanet.data);
        }
        catch (error) {
            next(error);
        }
    }
    static async deletePlanets(req, res, next) {
        try {
            const deletedPlanets = (await PlanetsService.deletePlanets());
            res.status(200).json(deletedPlanets.data);
        }
        catch (error) {
            next(error);
        }
    }
}
_a = PlanetsController;
PlanetsController.createPlanet = async (req, res, next) => {
    try {
        let result = [];
        let nextPage = 1;
        while (nextPage) {
            const response = await axios.get(`https://swapi.dev/api/planets/?page=${nextPage}`);
            const planets = response.data.results;
            for (const planet of planets) {
                const land = {
                    name: planet.name,
                    features: {
                        rotation_period: planet.rotation_period,
                        orbital_period: planet.orbital_period,
                        diameter: planet.diameter,
                        climate: planet.climate,
                        gravity: planet.gravity,
                        terrain: planet.terrain,
                        surface_water: planet.surface_water,
                        population: planet.population,
                    },
                    films: planet.films,
                    url: planet.url,
                };
                result.push(land);
            }
            nextPage = response.data.next && nextPage ? nextPage + 1 : null;
        }
        const planetCreated = (await PlanetsService.createPlanets(result));
        res.status(200).json(planetCreated);
    }
    catch (error) {
        next(error);
    }
};
export default PlanetsController;
