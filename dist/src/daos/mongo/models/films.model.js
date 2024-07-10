import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const filmsCollection = "films";
const filmsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    episode: { type: Number, required: true },
    features: {
        type: {
            director: {
                type: String,
                required: true,
            },
            producer: {
                type: String,
                required: true,
            },
            release_date: {
                type: Date,
                required: true,
            },
        },
    },
    characters: {
        type: [
            {
                type: String,
                required: true,
                ref: "people",
            },
        ],
    },
    planets: {
        type: [
            {
                type: String,
                required: true,
                ref: "planets",
            },
        ],
    },
    starships: {
        type: [
            {
                type: String,
                required: true,
                ref: "starships",
            },
        ],
    },
    url: {
        type: String,
        required: true,
    },
});
filmsSchema.plugin(mongoosePaginate);
const filmsModel = mongoose.model(filmsCollection, filmsSchema);
export default filmsModel;
