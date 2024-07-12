import StarWars from "../../../types/interfaces/sw.interface.js";
import planetModel from "../models/planets.model.js";
import CustomError from "../../../utils/customError.js";

export default class PlanetManagerMongo implements StarWars {
	model: any;
	constructor() {
		this.model = planetModel;
	}

	async create(planets: object[]): Promise<object> {
		const data = await this.model.insertMany(planets);
		if (data) {
			return { status: 200, data: data };
		} else {
			throw new CustomError(500, 1, "There was a problem creating planets");
		}
	}

	async getAll(paginate: { page: number }): Promise<object> {
		const { page } = paginate;
		const limit = 10;
		const skip = (page - 1) * limit;
		const planets = await this.model
			.find()
			.skip(skip)
			.limit(limit)
			.lean()
			.populate({
				path: "films",
				model: "films",
				select: "name _id",
				foreignField: "url",
			});

		const total = await this.model.countDocuments();
		if (planets.length > 0) {
			const info = {
				currentPage: page,
				totalPages: Math.ceil(total / limit),
				totalItems: total,
				itemsPerPage: limit,
			};
			planets.unshift(info);
			return {
				status: 200,
				data: planets,
			};
		} else if (planets.length === 0 || planets.length < 0) {
			return { status: 404, data: [] };
		} else {
			throw new CustomError(
				500,
				1,
				"An unknown error ocurred getting the planets"
			);
		}
	}

	async getById(id: string): Promise<object> {
		const planet = await this.model.findById(id).populate({
			path: "films",
			model: "films",
			select: "name _id",
			foreignField: "url",
		});
		if (planet) {
			return { status: 200, data: planet };
		} else {
			throw new CustomError(
				500,
				1,
				"An unknown error ocurred getting the planet"
			);
		}
	}

	async getFiltered(
		paginate: { page: number },
		data: {
			limit: number;
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

		const planets = await this.model.aggregate([
			matchStage,
			{
				$lookup: {
					from: "films",
					let: { films: "$films" },
					pipeline: [
						{ $match: { $expr: { $in: ["$url", "$$films"] } } },
						{ $project: { _id: 1, title: 1 } },
					],
					as: "filmDetails",
				},
			},
		]);
		const total = await this.model.countDocuments();
		if (planets.length > 0) {
			const info = {
				currentPage: page,
				totalPages: Math.ceil(total / limit),
				totalItems: total,
				itemsPerPage: limit,
			};
			planets.unshift(info);
			return {
				status: 200,
				data: planets,
			};
		} else if (planets.length === 0 || planets.length < 0) {
			return { status: 404, data: [] };
		} else {
			throw new CustomError(
				500,
				1,
				"An unknown error ocurred getting the planets"
			);
		}
	}

	async delete(): Promise<object> {
		const deletedPlanets = await planetModel.deleteMany();
		if (deletedPlanets) {
			return { status: 200, data: deletedPlanets };
		} else {
			throw new CustomError(
				500,
				1,
				"An unknown error ocurred while deleting the planets"
			);
		}
	}
}
