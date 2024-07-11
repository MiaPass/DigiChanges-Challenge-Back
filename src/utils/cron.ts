import express from "express";

import FilmsService from "../services/films.services.js";
import PeopleService from "../services/people.services.js";
import PlanetsService from "../services/planets.services.js";
import StarshipsService from "../services/starships.services.js";

let next: express.NextFunction;

const films = async () => {
	await FilmsService.deleteFilms(next);
	await FilmsService.createFilms(next);
};
const people = async () => {
	await PeopleService.deletePeople(next);
	await PeopleService.createPeople(next);
};
const planets = async () => {
	await PlanetsService.deletePlanets(next);
	await PlanetsService.createPlanets(next);
};
const starships = async () => {
	await StarshipsService.deleteStarships(next);
	await StarshipsService.createStarships(next);
};

async function weeklyTask() {
	const now = new Date();
	console.log(`Weekly task executed at: ${now.toISOString()}`);
	await films();
	await people();
	await planets();
	await starships();
}

export default weeklyTask;
