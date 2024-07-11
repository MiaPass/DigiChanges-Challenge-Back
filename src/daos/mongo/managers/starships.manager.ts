import StarWars from "../../../types/interfaces/sw.interface.js";
import starshipsModel from "../models/starships.model.js";
import CustomError from "../../../utils/customError.js";

export default class StarshipsManagerMongo implements StarWars {
	model: any;
	constructor() {
		this.model = starshipsModel;
	}

	async create(starships: object[]): Promise<object> {
		const data = await this.model.insertMany(starships);
		if (data) {
			return { status: 200, data: data };
		} else {
			throw new CustomError(500, 1, "There was a problem creating a starship");
		}
	}

	async getAll(): Promise<object> {
		const starships = await this.model
			.find()
			.populate({
				path: "pilots",
				model: "people",
				select: "name _id",
				foreignField: "url",
			})
			.populate({
				path: "films",
				model: "films",
				select: "name _id",
				foreignField: "url",
			})
			.limit(15);
		if (starships.length > 0) {
			return { status: 200, data: starships };
		} else if (starships.length === 0 || starships.length < 0) {
			return { status: 404, data: [] };
		} else {
			throw new CustomError(
				500,
				1,
				"An unknown error ocurred getting the starships"
			);
		}
	}

	async getById(id: string): Promise<object> {
		const starship = await this.model
			.findById(id)
			.populate({
				path: "pilots",
				model: "people",
				select: "name _id",
				foreignField: "url",
			})
			.populate({
				path: "films",
				model: "films",
				select: "name _id",
				foreignField: "url",
			});
		if (starship) {
			return { status: 200, data: starship };
		} else {
			throw new CustomError(
				500,
				1,
				"An unknown error ocurred getting the starship"
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

		const starship = await this.model.aggregate([
			matchStage,
			{
				$lookup: {
					from: "people",
					localField: "pilots",
					foreignField: "url",
					as: "pilots",
				},
			},
			{
				$lookup: {
					from: "films",
					localField: "films",
					foreignField: "url",
					as: "films",
				},
			},
			{
				$project: {
					_id: 1,
					name: 1,
					starship_model: 1,
					features: 1,
					url: 1,
					pilots: {
						$map: {
							input: "$pilots",
							as: "pilot",
							in: {
								_id: "$$pilot._id",
								name: "$$pilot.name",
							},
						},
					},
					films: {
						$map: {
							input: "$films",
							as: "film",
							in: {
								_id: "$$film._id",
								name: "$$film.name",
							},
						},
					},
				},
			},
			{
				$limit: limit,
			},
		]);

		if (starship.length > 0) {
			return { status: 200, data: starship };
		} else if (starship.length === 0 || starship.length < 0) {
			return { status: 404, data: [] };
		} else {
			throw new CustomError(
				500,
				1,
				"An unknown error ocurred getting the starship"
			);
		}
	}

	async delete(): Promise<object> {
		const deletedStarship = await starshipsModel.deleteMany();
		if (deletedStarship) {
			return { status: 200, data: deletedStarship };
		} else {
			throw new CustomError(
				500,
				1,
				"An unknown error ocurred while deleting the starships"
			);
		}
	}
}
