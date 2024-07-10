import { Router } from "express";
import PeopleController from "../controller/people.controller.js";

const router = Router();

router.post("/", PeopleController.createPeople);
router.get("/all", PeopleController.getPeople);
router.get("/id/:id", PeopleController.getPeopleById);
router.get("/filter", PeopleController.getPeopleFiltered);
router.put("/", PeopleController.updatePeople);
router.delete("/", PeopleController.deletePeople);

export default router;
