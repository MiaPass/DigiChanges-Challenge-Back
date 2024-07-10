import { Router } from "express";
import PlanetsController from "../controller/planets.controller";

const router = Router();

router.post("/", PlanetsController.createPlanet);
router.delete("/", PlanetsController.deletePlanets);

export default router;
