import StarWars from "../../../types/interfaces/sw.interface.js";
import filmsModel from "../models/films.model.js";
import CustomError from "../../../utils/customError.js";

export default class FilmsManagerMongo implements StarWars {
	model: any;
	constructor() {
		this.model = filmsModel;
	}

	async create(films: object[]): Promise<object> {
		const data = await this.model.insertMany(films);
		if (data) {
			return { status: 200, data: data };
		} else {
			throw new CustomError(500, 1, "There was a problem creating films");
		}
	}

	async getAll(): Promise<object> {
		const films = await this.model
			.find()
			.populate({
				path: "characters",
				model: "peoples",
				select: "name",
				foreignField: "url",
			})
			.populate({
				path: "planets",
				model: "planets",
				select: "name",
				foreignField: "url",
			})
			.populate({
				path: "starships",
				model: "starships",
				select: "name",
				foreignField: "url",
			})
			.limit(6);
		if (films.length > 0) {
			return { status: 200, data: films };
		} else if (films.length === 0 || films.length < 0) {
			return { status: 404, data: [] };
		} else {
			throw new CustomError(
				500,
				1,
				"An unknown error ocurred getting the films"
			);
		}
	}

	async getById(id: string): Promise<object> {
		const film = await this.model
			.findById(id)
			.populate({
				path: "characters",
				model: "peoples",
				select: "name",
				foreignField: "url",
			})
			.populate({
				path: "planets",
				model: "planets",
				select: "name",
				foreignField: "url",
			})
			.populate({
				path: "starships",
				model: "starships",
				select: "name",
				foreignField: "url",
			});
		if (film) {
			return { status: 200, data: film };
		} else {
			throw new CustomError(
				500,
				1,
				"An unknown error ocurred getting the films"
			);
		}
	}

	async getFiltered(data: {
		limit: number;
		queries: { field: string; value: string }[];
	}): Promise<object> {
		const { limit = 7, queries } = data;
		const matchStage = {
			$match: {
				$and: queries.map((query) => ({
					[query.field]: { $regex: query.value, $options: "i" },
				})),
			},
		};
		const film = await this.model.aggregate([
			matchStage,
			{
				$lookup: {
					from: "planets",
					let: { planet: "$planet" },
					pipeline: [
						{ $match: { $expr: { $in: ["$url", "$$planet"] } } },
						{ $project: { _id: 1, name: 1 } },
					],
					as: "planetsDetails",
				},
			},
			{
				$lookup: {
					from: "starships",
					let: { starships: "$starships" },
					pipeline: [
						{ $match: { $expr: { $in: ["$url", "$$starships"] } } },
						{ $project: { _id: 1, name: 1 } },
					],
					as: "starshipsDetails",
				},
			},
			{
				$lookup: {
					from: "peoples",
					let: { characters: "$characters" },
					pipeline: [
						{ $match: { $expr: { $in: ["$url", "$$characters"] } } },
						{ $project: { _id: 1, name: 1 } },
					],
					as: "peopleDetails",
				},
			},
			{
				$limit: limit,
			},
		]);

		if (film.length > 0) {
			return { status: 200, data: film };
		} else if (film.length === 0 || film.length < 0) {
			return { status: 404, data: [] };
		} else {
			throw new CustomError(
				500,
				1,
				"An unknown error ocurred getting the films"
			);
		}
	}

	async update(id: string, data: object): Promise<object> {
		const film = await this.model.findByIdAndUpdate({ _id: id }, data);
		if (film) {
			return { status: 200, data: film };
		} else {
			throw new CustomError(
				500,
				1,
				"An unknown error ocurred while updating the film"
			);
		}
	}

	async delete(): Promise<object> {
		const deletedFilms = await filmsModel.deleteMany();
		if (deletedFilms) {
			return { status: 200, data: deletedFilms };
		} else {
			throw new CustomError(
				500,
				1,
				"An unknown error ocurred while deleting the films"
			);
		}
	}
}
