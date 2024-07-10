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

	async getAll(): Promise<object> {
		const planets = await this.model
			.find()
			.populate({
				path: "films",
				model: "films",
				select: "name _id",
				foreignField: "url",
			})
			.limit(15);
		if (planets.length > 0) {
			return { status: 200, data: planets };
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

		// const planets = await this.model.find(filters, limit);
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
			{
				$limit: limit,
			},
		]);

		if (planets.length > 0) {
			return { status: 200, data: planets };
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

	async update(id: string, data: object): Promise<object> {
		const planet = await this.model.findByIdAndUpdate({ _id: id }, data);
		if (planet) {
			return { status: 200, data: planet };
		} else {
			throw new CustomError(
				500,
				1,
				"An unknown error ocurred while updating the planet"
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
