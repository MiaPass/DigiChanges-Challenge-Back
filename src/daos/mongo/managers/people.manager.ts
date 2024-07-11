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

	async getAll(): Promise<object> {
		const people = await this.model
			.find()
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
			})
			.limit(15);
		if (people.length > 0) {
			return { status: 200, data: people };
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
			{
				$limit: limit,
			},
		]);
		if (people.length > 0) {
			return { status: 200, data: people };
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
