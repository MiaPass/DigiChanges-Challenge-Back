import { Router } from "express";
import StarshipsController from "../controller/starships.controller.js";

const router = Router();

router.post("/", StarshipsController.createStarships);
router.get("/", StarshipsController.getStarships);
router.get("/id/:id", StarshipsController.getStarshipById);
router.get("/filter", StarshipsController.getStarshipsFiltered);
router.put("/", StarshipsController.updateStarship);
router.delete("/", StarshipsController.deleteStarships);

export default router;
