var _a;
import axios from "axios";
import PeopleService from "../services/people.services";
class PeopleController {
    static async getPeople(req, res, next) {
        try {
            const people = (await PeopleService.getPeople());
            res.status(200).json(people.data);
        }
        catch (error) {
            next(error);
        }
    }
    static async getPeopleById(req, res, next) {
        try {
            const { id } = req.params;
            const planet = (await PeopleService.getPeopleById(id));
            res.status(200).json(planet.data);
        }
        catch (error) {
            next(error);
        }
    }
    static async getPeopleFiltered(req, res, next) {
        try {
            const { data } = req.body;
            const filteredPeople = (await PeopleService.getPeopleFiltered(data));
            res.status(200).json(filteredPeople.data);
        }
        catch (error) {
            next(error);
        }
    }
    static async updatePeople(req, res, next) {
        try {
            const { id } = req.params;
            const { data } = req.body;
            const updatedCharacter = (await PeopleService.updatePeople(id, data));
            res.status(200).json(updatedCharacter.data);
        }
        catch (error) {
            next(error);
        }
    }
    static async deletePeople(req, res, next) {
        try {
            const deletedPeople = (await PeopleService.deletePeople());
            res.status(200).json(deletedPeople.data);
        }
        catch (error) {
            next(error);
        }
    }
}
_a = PeopleController;
PeopleController.createPeople = async (req, res, next) => {
    try {
        let result = [];
        let nextPage = 1;
        while (nextPage) {
            const response = await axios.get(`https://swapi.dev/api/people/?page=${nextPage}`);
            const people = response.data.results;
            for (const person of people) {
                const character = {
                    name: person.name,
                    features: {
                        height: person.height,
                        mass: person.mass,
                        hair_color: person.hair_color,
                        skin_color: person.skin_color,
                        eye_color: person.eye_color,
                        birth_year: person.birth_year,
                        gender: person.gender,
                    },
                    films: person.films,
                    planet: person.homeworld,
                    starships: person.starships,
                    url: person.url,
                };
                result.push(character);
            }
            nextPage = response.data.next && nextPage ? nextPage + 1 : null;
        }
        const characterCreated = (await PeopleService.createPeople(result));
        res.status(200).json(characterCreated);
    }
    catch (error) {
        next(error);
    }
};
export default PeopleController;
