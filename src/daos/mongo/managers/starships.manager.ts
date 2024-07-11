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
		const { page } = paginate;

		const limit = 10;
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

			return {
				status: 200,
				data: transformedStarships,
				pagination: {
					currentPage: page,
					totalPages: Math.ceil(total / limit),
					totalItems: total,
					itemsPerPage: limit,
				},
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
		data: {
			queries: { field: string; value: string }[];
		}
	): Promise<object> {
		const { page } = paginate;
		const { queries } = data;
		const limit = 10;
		const skip = (page - 1) * limit;

		const filter = queries.reduce((acc, query) => {
			acc[query.field] = { $regex: query.value, $options: "i" };
			return acc;
		}, {});

		try {
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

				return {
					status: 200,
					data: transformedStarships,
					pagination: {
						currentPage: page,
						totalPages: Math.ceil(total / limit),
						totalItems: total,
						itemsPerPage: limit,
					},
				};
			} else {
				return { status: 404, data: [] };
			}
		} catch (error) {
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
