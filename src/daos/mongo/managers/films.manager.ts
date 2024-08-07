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
		let { page } = paginate;
		const limit = 12;
		if (!page) page = 1;
		const skip = (page - 1) * limit;
		const films = await this.model
			.find()
			.skip(skip)
			.limit(limit)
			.lean()
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
		field: string,
		value: string
	): Promise<object> {
		let { page } = paginate;
		if (!page) page = 1;
		const limit = 12;

		const matchStage = {
			$match: {
				$or: [
					{ [field]: { $regex: value, $options: "i" } },
					{ [field]: parseFloat(value) },
				],
			},
		};

		const films = await this.model.aggregate([
			matchStage,
			{
				$lookup: {
					from: "planets",
					let: { planets: "$planets" },
					pipeline: [
						{
							$match: {
								$expr: {
									$cond: {
										if: { $isArray: "$$planets" },
										then: { $in: ["$url", "$$planets"] },
										else: { $eq: ["$url", "$$planets"] },
									},
								},
							},
						},
						{ $project: { _id: 1, name: 1 } },
					],
					as: "planets",
				},
			},
			{
				$lookup: {
					from: "starships",
					let: { starships: "$starships" },
					pipeline: [
						{
							$match: {
								$expr: {
									$cond: {
										if: { $isArray: "$$starships" },
										then: { $in: ["$url", "$$starships"] },
										else: { $eq: ["$url", "$$starships"] },
									},
								},
							},
						},
						{ $project: { _id: 1, name: 1 } },
					],
					as: "starships",
				},
			},
			{
				$lookup: {
					from: "people",
					let: { people: "$characters" },
					pipeline: [
						{
							$match: {
								$expr: {
									$cond: {
										if: { $isArray: "$$people" },
										then: { $in: ["$url", "$$people"] },
										else: { $eq: ["$url", "$$people"] },
									},
								},
							},
						},
						{ $project: { _id: 1, name: 1 } },
					],
					as: "characters",
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
