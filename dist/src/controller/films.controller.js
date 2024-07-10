var _a;
import axios from "axios";
import FilmsService from "../services/films.services";
class FilmsController {
    static async getFilms(req, res, next) {
        try {
            const films = (await FilmsService.getFilms());
            res.status(200).json(films.data);
        }
        catch (error) {
            next(error);
        }
    }
    static async getFilmById(req, res, next) {
        try {
            const { id } = req.params;
            const film = (await FilmsService.getFilmById(id));
            res.status(200).json(film.data);
        }
        catch (error) {
            next(error);
        }
    }
    static async getFilmsFiltered(req, res, next) {
        try {
            const { data } = req.body;
            const filteredFilms = (await FilmsService.getFilmsFiltered(data));
            res.status(200).json(filteredFilms.data);
        }
        catch (error) {
            next(error);
        }
    }
    static async updateFilm(req, res, next) {
        try {
            const { id } = req.params;
            const { data } = req.body;
            const updatedFilm = (await FilmsService.updateFilm(id, data));
            res.status(200).json(updatedFilm.data);
        }
        catch (error) {
            next(error);
        }
    }
    static async deleteFilms(req, res, next) {
        try {
            const deletedFilms = (await FilmsService.deleteFilms());
            res.status(200).json(deletedFilms.data);
        }
        catch (error) {
            next(error);
        }
    }
}
_a = FilmsController;
FilmsController.createFilms = async (req, res, next) => {
    try {
        let result = [];
        let nextPage = 1;
        while (nextPage) {
            const response = await axios.get(`https://swapi.dev/api/films/?page=${nextPage}`);
            const films = response.data.results;
            for (const film of films) {
                const movie = {
                    name: film.title,
                    episode: film.episode_id,
                    features: {
                        director: film.director,
                        producer: film.producer,
                        release_date: film.release_date,
                    },
                    characters: film.characters,
                    planets: film.planets,
                    starships: film.starships,
                    url: film.url,
                };
                result.push(movie);
            }
            nextPage = response.data.next && nextPage ? nextPage + 1 : null;
        }
        const filmsCreated = (await FilmsService.createFilms(result));
        res.status(200).json(filmsCreated);
    }
    catch (error) {
        next(error);
    }
};
export default FilmsController;
