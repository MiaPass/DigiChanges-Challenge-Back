import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

import StarshipInterface from "../../../types/interfaces/starships.interface";

const starshipsCollection: string = "starships";

const starshipsSchema: Schema<StarshipInterface> = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true,
	},
	starship_model: {
		type: String,
		required: true,
		unique: true,
	},
	features: {
		type: {
			manufacturer: { type: String },
			cost_in_credits: { type: String },
			length: { type: String },
			max_atmosphering_speed: { type: String },
			crew: { type: String },
			passengers: { type: String },
			cargo_capacity: { type: String },
			consumables: { type: String },
			hyperdrive_rating: { type: String },
			class: { type: String },
		},
	},
	pilots: { type: [{ type: String, required: true, ref: "people" }] },
	films: { type: [{ type: String, required: true, ref: "films" }] },
	url: { type: String, required: true },
});

starshipsSchema.plugin(mongoosePaginate);

const starshipsModel = mongoose.model(starshipsCollection, starshipsSchema);

export default starshipsModel;
