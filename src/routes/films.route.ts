import { Router } from "express";
import FilmsController from "../controller/films.controller.js";

const router = Router();

router.get("/", FilmsController.getFilms);

export default router;
