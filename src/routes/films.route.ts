import { Router } from "express";
import FilmsController from "../controller/films.controller.js";

const router = Router();

router.post("/", FilmsController.createFilms);
router.get("/all", FilmsController.getFilms);
router.get("/id/:id", FilmsController.getFilmById);
router.get("/filter", FilmsController.getFilmsFiltered);
router.put("/", FilmsController.updateFilm);
router.delete("/", FilmsController.deleteFilms);

export default router;
