import { Router } from "express";
import PlanetsController from "../controller/planets.controller.js";

const router = Router();

router.post("/", PlanetsController.createPlanet);
router.get("/all", PlanetsController.getPlanets);
router.get("/id/:id", PlanetsController.getPlanetById);
router.get("/filter", PlanetsController.getPlanetsFiltered);
router.put("/", PlanetsController.updatePlanet);
router.delete("/", PlanetsController.deletePlanets);

export default router;
