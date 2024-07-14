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
		let { page } = paginate;
		if (!page) page = 1;
		const limit = 12;
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
		const people = await this.model.aggregate([
			matchStage,
			{
				$lookup: {
					from: "planets",
					let: { planets: "$planet" },
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
					as: "planet",
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
