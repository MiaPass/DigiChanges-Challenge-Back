import { Router } from "express";

import filmsRouter from "./films.route";
import peopleRouter from "./people.route";
import planetsRouter from "./planets.route";
import starshipsRouter from "./starships.route";

const router = Router();

router.use("/films", filmsRouter);
router.use("/people", peopleRouter);
router.use("/planets", planetsRouter);
router.use("/starships", starshipsRouter);

export default router;
