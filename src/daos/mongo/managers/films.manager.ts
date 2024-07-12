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

	async getAll(paginate: { page: number }): Promise<object> {
		const { page } = paginate;
		const limit = 10;
		const films = await this.model
			.find()
			.populate({
				path: "characters",
				model: "people",
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
		const total = await this.model.countDocuments();

		if (films.length > 0) {
			const info = {
				currentPage: page,
				totalPages: Math.ceil(total / limit),
				totalItems: total,
				itemsPerPage: limit,
			};
			films.unshift(info);
			return {
				status: 200,
				data: films,
			};
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
				model: "people",
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

	async getFiltered(
		paginate: { page: number },
		data: {
			queries: { field: string; value: string }[];
		}
	): Promise<object> {
		const { page } = paginate;
		const { queries } = data;
		const limit = 10;
		const matchStage = {
			$match: {
				$and: queries.map((query) => ({
					[query.field]: { $regex: query.value, $options: "i" },
				})),
			},
		};
		const films = await this.model.aggregate([
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
					from: "people",
					let: { characters: "$characters" },
					pipeline: [
						{ $match: { $expr: { $in: ["$url", "$$characters"] } } },
						{ $project: { _id: 1, name: 1 } },
					],
					as: "peopleDetails",
				},
			},
		]);
		const total = await this.model.countDocuments();

		if (films.length > 0) {
			const info = {
				currentPage: page,
				totalPages: Math.ceil(total / limit),
				totalItems: total,
				itemsPerPage: limit,
			};
			films.unshift(info);
			return {
				status: 200,
				data: films,
			};
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
