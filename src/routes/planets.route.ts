import { Router } from "express";
import PlanetsController from "../controller/planets.controller.js";

const router = Router();

router.get("/", PlanetsController.getPlanets);

export default router;
