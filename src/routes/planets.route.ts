import { Router } from "express";
import PlanetsController from "../controller/planets.controller.js";

const router = Router();

router.post("/", PlanetsController.createPlanet);
router.delete("/", PlanetsController.deletePlanets);

export default router;
