import { Router } from "express";

import filmsRouter from "./films.route.js";
import peopleRouter from "./people.route.js";
import planetsRouter from "./planets.route.js";
import starshipsRouter from "./starships.route.js";

const router = Router();

router.use("/films", filmsRouter);
router.use("/people", peopleRouter);
router.use("/planets", planetsRouter);
router.use("/starships", starshipsRouter);

export default router;
