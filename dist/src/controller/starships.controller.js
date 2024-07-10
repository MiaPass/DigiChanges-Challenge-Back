var _a;
import axios from "axios";
import StarshipsService from "../services/starships.services";
class StarshipsController {
    static async updateStarship(req, res, next) {
        try {
            const { id } = req.params;
            const { data } = req.body;
            const updatedStarship = await StarshipsService.updateStarship(id, data);
            res.status(200).json(updatedStarship);
        }
        catch (error) {
            next(error);
        }
    }
}
_a = StarshipsController;
StarshipsController.createStarships = async (req, res, next) => {
    try {
        let result = [];
        let nextPage = 1;
        while (nextPage) {
            const response = await axios.get(`https://swapi.dev/api/starships/?page=${nextPage}`);
            const starships = response.data.results;
            for (const starship of starships) {
                const ship = {
                    name: starship.name,
                    starship_model: starship.model,
                    features: {
                        manufacturer: starship.manufacturer,
                        cost_in_credits: starship.cost_in_credits,
                        length: starship.length,
                        max_atmosphering_speed: starship.max_atmosphering_speed,
                        crew: starship.crew,
                        passengers: starship.passengers,
                        cargo_capacity: starship.cargo_capacity,
                        consumables: starship.consumables,
                        hyperdrive_rating: starship.hyperdrive_rating,
                        class: starship.class,
                    },
                    pilots: starship.pilots,
                    films: starship.films,
                    url: starship.url,
                };
                result.push(ship);
            }
            nextPage = response.data.next && nextPage ? nextPage + 1 : null;
        }
        const starshipsCreated = (await StarshipsService.createStarships(result));
        res.status(200).json(starshipsCreated);
    }
    catch (error) {
        next(error);
    }
};
StarshipsController.getStarships = async (req, res, next) => {
    try {
        const starships = (await StarshipsService.getStarships());
        res.status(starships.status).json(starships.data);
    }
    catch (error) {
        next(error);
    }
};
StarshipsController.getStarshipById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const starship = (await StarshipsService.getStarshipById(id));
        res.status(200).json(starship.data);
    }
    catch (error) {
        next(error);
    }
};
StarshipsController.getStarshipsFiltered = async (req, res, next) => {
    try {
        const { data } = req.body;
        const starshipsFiltered = (await StarshipsService.getStarshipsFiltered(data));
        res.status(starshipsFiltered.status).json(starshipsFiltered.data);
    }
    catch (error) {
        next(error);
    }
};
StarshipsController.deleteStarships = async (req, res, next) => {
    try {
        const deleted = (await StarshipsService.deleteStarships());
        res.status(200).json(deleted.data);
    }
    catch (error) {
        next(error);
    }
};
export default StarshipsController;
