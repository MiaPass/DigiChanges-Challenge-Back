import express from "express";

import PeopleService from "../services/people.services.js";

export default class PeopleController {
	static async getPeople(
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	): Promise<void> {
		try {
			const { page } = req.query;
			const { id, data } = req.body;

			let paginate = { page: page };

			if (id && !data) {
				const person = (await PeopleService.getPeopleById(id)) as { data: any };
				res.status(200).json(person.data);
			} else if (data && !id) {
				const peopleFiltered = (await PeopleService.getPeopleFiltered(
					paginate,
					data
				)) as { pagination: any; data: any };
				res.status(200).json(peopleFiltered.data);
			} else if (!id && !data) {
				const people = (await PeopleService.getPeople(paginate)) as {
					data: any;
					pagination: any;
				};

				res.status(200).json(people.data);
			} else {
				res.status(500).json({ message: "Wrong body request" });
			}
		} catch (error: unknown) {
			next(error);
		}
	}
}
