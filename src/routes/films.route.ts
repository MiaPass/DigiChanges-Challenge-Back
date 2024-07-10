import { Router } from "express";
import FilmsController from "../controller/films.controller.js";

const router = Router();

router.post("/", FilmsController.createFilms);
router.delete("/", FilmsController.deleteFilms);

export default router;
