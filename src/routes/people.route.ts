import { Router } from "express";
import PeopleController from "../controller/people.controller.js";

const router = Router();

router.post("/", PeopleController.createPeople);
router.delete("/", PeopleController.deletePeople);

export default router;
