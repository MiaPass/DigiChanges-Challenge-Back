import express from "express";

import PeopleService from "../services/people.services.js";

export default class PeopleController {
	static async getPeople(
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	): Promise<void> {
		try {
			const { page, field, value } = req.query;
			const { id } = req.params;
			const newValue =
				value !== undefined && typeof value === "string" && value.includes("_")
					? value.replace(/_/g, " ")
					: value !== undefined
					? value
					: null;
			let paginate = { page: Number(page) };

			if (id && !field && !newValue) {
				const person = (await PeopleService.getPeopleById(id)) as { data: any };
				res.status(200).json(person.data);
			} else if (field && newValue && !id) {
				const peopleFiltered = (await PeopleService.getPeopleFiltered(
					paginate,
					field,
					newValue
				)) as { data: any };
				res.status(200).json(peopleFiltered.data);
			} else if (!id && !field && !newValue) {
				const people = (await PeopleService.getPeople(paginate)) as {
					data: any;
				};

				res.status(200).json(people.data);
			}
		} catch (error: unknown) {
			next(error);
		}
	}
}
