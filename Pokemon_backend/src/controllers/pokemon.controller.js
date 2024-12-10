import fs from "fs";
import { parse } from "csv";
import Pokemon from "../models/pokemon.model.js";

//import csv
export const importCSV = async (req, res) => {
  try {
    const pokemons = [];

    // Thêm các options cho csv parser
    const parserOptions = {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      bom: true, // Xử lý BOM character
      relax_quotes: true, // Xử lý quotes linh hoạt hơn
      relax_column_count: true, // Cho phép số lượng cột không đồng đều
    };

    const parser = fs
      .createReadStream(req.file.path)
      .pipe(parse(parserOptions));

    parser.on("data", (row) => {
      try {
        pokemons.push({
          id: Number(row.id) || 0,
          name: row.name?.trim() || "",
          type1: row.type1?.trim() || "",
          type2: row.type2?.trim() || "",
          total: Number(row.total) || 0,
          hp: Number(row.hp) || 0,
          attack: Number(row.attack) || 0,
          defense: Number(row.defense) || 0,
          spAttack: Number(row.spAttack) || 0,
          spDefense: Number(row.spDefense) || 0,
          speed: Number(row.speed) || 0,
          generation: Number(row.generation) || 1,
          legendary: String(row.legendary).toLowerCase() === "true",
          image: row.image?.trim() || "",
          ytbUrl: row.ytbUrl?.trim() || "",
        });
      } catch (error) {
        console.error("Error processing row:", error);
      }
    });

    parser.on("error", (error) => {
      console.error("Parser error:", error);
      fs.unlinkSync(req.file.path);
      res
        .status(400)
        .json({ message: "Error parsing CSV file", error: error.message });
    });

    parser.on("end", async () => {
      try {
        if (pokemons.length > 0) {
          await Pokemon.insertMany(pokemons);
          fs.unlinkSync(req.file.path);
          res.status(201).json({
            message: "Data imported successfully",
            count: pokemons.length,
          });
        } else {
          throw new Error("No valid data found in CSV");
        }
      } catch (error) {
        console.error("Database error:", error);
        fs.unlinkSync(req.file.path);
        res.status(500).json({
          message: "Failed to import data to database",
          error: error.message,
        });
      }
    });
  } catch (error) {
    console.error("General error:", error);
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }
    res
      .status(500)
      .json({ message: "Failed to process file", error: error.message });
  }
};

//get list pokemon
export const getAll = async (req, res) => {
  try {
    const { type, name } = req.query;
    const filter = {};

    if (type) filter.$or = [{ type1: type }, { type2: type }];
    if (name) filter.name = new RegExp(name, "i");

    const pokemons = await Pokemon.find(filter);
    res.status(200).json(pokemons);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch data" });
  }
};

//get pokemon by id
export const getById = async (req, res) => {
  try {
    const pokemon = await Pokemon.findOne({ id: req.params.id });
    if (!pokemon) return res.status(404).json({ error: "Pokémon not found" });
    res.status(200).json(pokemon);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch detail Pokemon" });
  }
};

//mark or unMark favorite pokemon
export const markFavorite = async (req, res) => {
  try {
    const pokemon = await Pokemon.findOne({ id: req.params.id });
    if (!pokemon) return res.status(404).json({ error: "Pokémon not found" });

    pokemon.favorite = !pokemon.favorite;
    await pokemon.save();

    res.status(200).json(pokemon);
  } catch (error) {
    res.status(500).json({ message: "Failed to mark favorite" });
  }
};

//get favorite pokemon list
export const getFavorite = async (req, res) => {
  try {
    const pokemons = await Pokemon.find({ favorite: true });
    res.status(200).json(pokemons);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch favorite Pokemon" });
  }
};
