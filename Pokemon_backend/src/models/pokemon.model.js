import mongoose from "mongoose";

const pokemonSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  type1: {
    type: String,
    required: true,
  },
  type2: {
    type: String,
    default: "",
  },
  total: {
    type: Number,
    required: true,
  },
  hp: {
    type: Number,
    required: true,
  },
  attack: {
    type: Number,
    required: true,
  },
  defense: {
    type: Number,
    required: true,
  },
  spAttack: {
    type: Number,
    required: true,
  },
  spDefense: {
    type: Number,
    required: true,
  },
  speed: {
    type: Number,
    required: true,
  },
  generation: {
    type: Number,
    required: true,
  },
  legendary: {
    type: Boolean,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  ytbUrl: {
    type: String,
    required: true,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
});

const Pokemon = mongoose.model("Pokemon", pokemonSchema);

export default Pokemon;
