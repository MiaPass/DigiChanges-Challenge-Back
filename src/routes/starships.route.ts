import { Router } from "express";
import StarshipsController from "../controller/starships.controller.js";

const router = Router();

router.get("/", StarshipsController.getStarships);

export default router;
