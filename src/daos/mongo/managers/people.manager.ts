import StarWars from "../../../types/interfaces/sw.interface.js";
import peopleModel from "../models/people.model.js";
import CustomError from "../../../utils/customError.js";

export default class PeopleManagerMongo implements StarWars {
	model: any;
	constructor() {
		this.model = peopleModel;
	}

	async create(people: object[]): Promise<object> {
		const data = await this.model.insertMany(people);
		if (data) {
			return { status: 200, data: data };
		} else {
			throw new CustomError(500, 1, "There was a problem creating people");
		}
	}

	async getAll(paginate: { page: number }): Promise<object> {
		const { page } = paginate;
		const limit = 10;
		const skip = (page - 1) * limit;
		const people = await this.model
			.find()
			.skip(skip)
			.limit(limit)
			.lean()
			.populate({
				path: "planet",
				model: "planets",
				select: "name",
				foreignField: "url",
			})
			.populate({
				path: "films",
				model: "films",
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
		if (people.length > 0) {
			const info = {
				currentPage: page,
				totalPages: Math.ceil(total / limit),
				totalItems: total,
				itemsPerPage: limit,
			};
			people.unshift(info);
			return {
				status: 200,
				data: people,
			};
		} else if ((people.length = 0)) {
			return { status: 404, data: [], pagination: null };
		} else {
			throw new CustomError(
				500,
				1,
				"An unknown error ocurred getting the people"
			);
		}
	}

	async getById(id: string): Promise<object> {
		const character = await this.model
			.findById(id)
			.populate({
				path: "planet",
				model: "planets",
				select: "name",
				foreignField: "url",
			})
			.populate({
				path: "films",
				model: "films",
				select: "name",
				foreignField: "url",
			})
			.populate({
				path: "starships",
				model: "starships",
				select: "name",
				foreignField: "url",
			});

		if (character) {
			return { status: 200, data: character };
		} else {
			throw new CustomError(
				500,
				1,
				"An unknown error ocurred getting the character"
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
		const people = await this.model.aggregate([
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
					from: "films",
					let: { films: "$films" },
					pipeline: [
						{ $match: { $expr: { $in: ["$url", "$$films"] } } },
						{ $project: { _id: 1, name: 1 } },
					],
					as: "filmsDetails",
				},
			},
		]);
		const total = await this.model.countDocuments();
		if (people.length > 0) {
			const info = {
				currentPage: page,
				totalPages: Math.ceil(total / limit),
				totalItems: total,
				itemsPerPage: limit,
			};
			people.unshift(info);
			return {
				status: 200,
				data: people,
			};
		} else if (people.length === 0 || people.length < 0) {
			return { status: 404, data: [] };
		} else {
			throw new CustomError(
				500,
				1,
				"An unknown error ocurred getting the people"
			);
		}
	}

	async delete(): Promise<object> {
		const deletedPeople = await peopleModel.deleteMany();
		if (deletedPeople) {
			return { status: 200, data: deletedPeople };
		} else {
			throw new CustomError(
				500,
				1,
				"An unknown error ocurred while deleting the people"
			);
		}
	}
}
