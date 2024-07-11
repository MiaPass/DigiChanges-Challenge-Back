import { Router } from "express";
import PeopleController from "../controller/people.controller.js";

const router = Router();

router.get("/", PeopleController.getPeople);

export default router;
