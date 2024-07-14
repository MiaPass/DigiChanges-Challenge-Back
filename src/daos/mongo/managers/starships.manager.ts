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

	async getAll(paginate: { page: number }): Promise<object> {
		let { page } = paginate;

		const limit = 12;
		if (!page) page = 1;
		const skip = (page - 1) * limit;

		const [starships, total] = await Promise.all([
			this.model
				.find()
				.skip(skip)
				.limit(limit)
				.lean()
				.populate({
					path: "pilots",
					model: "people",
					select: "name",
					foreignField: "url",
				})
				.populate({
					path: "films",
					model: "films",
					select: "name",
					foreignField: "url",
				}),
			this.model.countDocuments(),
		]);

		if (starships.length > 0) {
			const transformedStarships = starships.map((starship) => ({
				...starship,
				pilots: starship.pilots.map((pilot) => ({
					_id: pilot._id,
					name: pilot.name,
				})),
				films: starship.films.map((film) => ({
					_id: film._id,
					name: film.name,
				})),
			}));

			const info = {
				currentPage: page,
				totalPages: Math.ceil(total / limit),
				totalItems: total,
				itemsPerPage: limit,
			};

			transformedStarships.unshift(info);
			return {
				status: 200,
				data: transformedStarships,
			};
		} else if (starships.length === 0) {
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

	async getFiltered(
		paginate: { page: number },
		field: string,
		value: string
	): Promise<object> {
		let { page } = paginate;

		if (!page) page = 1;

		const limit = 12;
		const skip = (page - 1) * limit;

		let filter: any;
		if (field.startsWith("features.")) {
			// For nested fields in features
			filter = {
				$or: [
					{ [field]: { $regex: value, $options: "i" } },
					{ [field]: parseFloat(value) },
				],
			};
		} else {
			// For top-level fields
			filter = {
				$or: [
					{ [field]: { $regex: value, $options: "i" } },
					{ [field]: parseFloat(value) },
				],
			};
		}

		const [starships, total] = await Promise.all([
			this.model
				.find(filter)
				.skip(skip)
				.limit(limit)
				.lean()
				.populate({
					path: "pilots",
					model: "people",
					select: "name",
					foreignField: "url",
				})
				.populate({
					path: "films",
					model: "films",
					select: "name",
					foreignField: "url",
				}),
			this.model.countDocuments(filter),
		]);

		if (starships.length > 0) {
			const transformedStarships = starships.map((starship: any) => ({
				...starship,
				pilots: starship.pilots.map((pilot: any) => ({
					_id: pilot._id,
					name: pilot.name,
				})),
				films: starship.films.map((film: any) => ({
					_id: film._id,
					name: film.name,
				})),
			}));

			const info = {
				currentPage: page,
				totalPages: Math.ceil(total / limit),
				totalItems: total,
				itemsPerPage: limit,
			};

			return {
				status: 200,
				data: [info, ...transformedStarships],
			};
		} else if (starships.length === 0 || starships.length < 0) {
			return { status: 404, data: [] };
		} else {
			throw new CustomError(
				500,
				1,
				"An unknown error occurred getting the starships"
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
