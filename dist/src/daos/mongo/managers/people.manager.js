import peopleModel from "../models/people.model";
import CustomError from "../../../utils/customError";
export default class PeopleManagerMongo {
    constructor() {
        this.model = peopleModel;
    }
    async create(people) {
        const data = await this.model.insertMany(people);
        if (data) {
            return { status: 200, data: data };
        }
        else {
            throw new CustomError(500, 1, "There was a problem creating people");
        }
    }
    async getAll() {
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
        }
        else if (people.length === 0 || people.length < 0) {
            return { status: 404, data: [] };
        }
        else {
            throw new CustomError(500, 1, "An unknown error ocurred getting the people");
        }
    }
    async getById(id) {
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
        }
        else {
            throw new CustomError(500, 1, "An unknown error ocurred getting the character");
        }
    }
    async getFiltered(data) {
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
        }
        else if (people.length === 0 || people.length < 0) {
            return { status: 404, data: [] };
        }
        else {
            throw new CustomError(500, 1, "An unknown error ocurred getting the people");
        }
    }
    async update(id, data) {
        const character = await this.model.findByIdAndUpdate({ _id: id }, data);
        if (character) {
            return { status: 200, data: character };
        }
        else {
            throw new CustomError(500, 1, "An unknown error ocurred while updating the character");
        }
    }
    async delete() {
        const deletedPeople = await peopleModel.deleteMany();
        if (deletedPeople) {
            return { status: 200, data: deletedPeople };
        }
        else {
            throw new CustomError(500, 1, "An unknown error ocurred while deleting the people");
        }
    }
}
