import express from "express";
import {
  getAll,
  getById,
  getFavorite,
  importCSV,
  markFavorite,
} from "../controllers/pokemon.controller.js";
import multer from "multer";

const router = express.Router();
const updload = multer({ dest: "uploads/" });

router.post("/import", updload.single("file"), importCSV);
router.get("", getAll);
router.get("/:id", getById);
router.post("/favorite/:id", markFavorite);
router.get("/favorites", getFavorite);

export default router;
