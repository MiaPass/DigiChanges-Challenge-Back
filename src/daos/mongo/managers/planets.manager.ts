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
		let { page } = paginate;
		const limit = 12;
		if (!page) page = 1;
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
		field: string,
		value: string
	): Promise<object> {
		let { page } = paginate;
		if (!page) page = 1;
		const limit = 12;

		if (field === "terrain") {
			field = "features.terrain";
		}
		const matchStage = {
			$match: {
				$or: [
					{ [field]: { $regex: value, $options: "i" } },
					{ [field]: parseFloat(value) },
				],
			},
		};

		const planets = await this.model.aggregate([
			matchStage,
			{
				$lookup: {
					from: "films",
					let: { films: "$films" },
					pipeline: [
						{
							$match: {
								$expr: {
									$cond: {
										if: { $isArray: "$$films" },
										then: { $in: ["$url", "$$films"] },
										else: { $eq: ["$url", "$$films"] },
									},
								},
							},
						},
						{ $project: { _id: 1, name: 1 } },
					],
					as: "films",
				},
			},
		]);

		const total = await this.model.countDocuments(matchStage.$match);

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
