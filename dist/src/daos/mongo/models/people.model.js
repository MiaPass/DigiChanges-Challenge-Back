import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const peopleCollection = "people";
const peopleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    features: {
        type: {
            height: { type: String },
            mass: { type: String },
            hair_color: { type: String },
            skin_color: { type: String },
            eye_color: { type: String },
            birth_year: { type: String },
            gender: { type: String },
        },
    },
    planet: { type: String, required: true, ref: "planets" },
    films: { type: [{ type: String, required: true, ref: "films" }] },
    starships: {
        type: [{ type: String, required: true, ref: "starships" }],
    },
    url: { type: String, required: true },
});
peopleSchema.plugin(mongoosePaginate);
const peopleModel = mongoose.model(peopleCollection, peopleSchema);
export default peopleModel;
