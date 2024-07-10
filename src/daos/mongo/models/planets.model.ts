import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

import PlanetInterface from "../../../types/interfaces/planets.interface.js";

const planetsCollection: string = "planets";

const planetsSchema: Schema<PlanetInterface> = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true,
	},
	category: { type: String, required: true },
	features: {
		type: {
			rotation_period: { type: String },
			orbital_period: { type: String },
			diameter: { type: String },
			climate: { type: String },
			gravity: { type: String },
			terrain: { type: String },
			surface_water: { type: String },
			population: { type: String },
		},
	},
	films: { type: [{ type: String }], required: true, ref: "films" },
	url: { type: String, required: true },
});

planetsSchema.plugin(mongoosePaginate);

const planetsModel = mongoose.model(planetsCollection, planetsSchema);

export default planetsModel;
