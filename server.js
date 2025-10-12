// server.js
import express from "express";
import fs from "fs";
import cors from "cors";
import { EventEmitter } from "events";

export const reviewEvents = new EventEmitter();

const app = express();
const PORT = 3000;
const FILE_REVIEWS = "./reviews.json";

app.use(cors());
app.use(express.json());

// --- Fonctions utilitaires ---
function loadJSON(path, defaultValue = []) {
  if (!fs.existsSync(path)) return defaultValue;
  try {
    return JSON.parse(fs.readFileSync(path, "utf8"));
  } catch {
    return defaultValue;
  }
}

function saveJSON(path, data) {
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

// --- Générer un ID unique ---
function generateId(prefix = "rv") {
  const random = Math.floor(Math.random() * 1000000).toString().padStart(6, "0");
  const timestamp = Date.now().toString().slice(-6);
  return `${prefix}_${timestamp}${random}`;
}

// --- Routes ---
app.post("/api/reviews", (req, res) => {
  const { pseudo, rating, comment } = req.body;
  if (!pseudo || !rating || !comment) {
    return res.status(400).json({ error: "Champs manquants" });
  }

  const reviews = loadJSON(FILE_REVIEWS);
  const newReview = {
    id: generateId(),         // <-- ID unique généré
    pseudo,
    rating: Number(rating),
    comment,
    createdAt: Date.now()
  };

  reviews.push(newReview);
  saveJSON(FILE_REVIEWS, reviews);

  reviewEvents.emit("newReview", newReview);

  console.log(`🆕 Nouvel avis ajouté par ${pseudo}`);
  res.json({ success: true, review: newReview });
});

app.get("/api/reviews", (req, res) => {
  const reviews = loadJSON(FILE_REVIEWS);
  res.json({ reviews, total: reviews.length });
});

app.get("/api/summary", (req, res) => {
  const reviews = loadJSON(FILE_REVIEWS);
  const total = reviews.length;
  const average = total > 0 ? reviews.reduce((a, r) => a + r.rating, 0) / total : 0;
  res.json({ total, average });
});

app.listen(PORT, () => console.log(`🚀 Serveur en ligne sur http://localhost:${PORT}`));
