import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

let db;

async function initDb() {
  db = await open({
    filename: "./database.db",
    driver: sqlite3.Database
  });

  // Création des tables si elles n'existent pas
  await db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS heats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS teams (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      athlete1 TEXT NOT NULL,
      athlete2 TEXT NOT NULL,
      category_id INTEGER,
      heat_id INTEGER,
      score INTEGER DEFAULT 0,
      FOREIGN KEY (category_id) REFERENCES categories(id),
      FOREIGN KEY (heat_id) REFERENCES heats(id)
    );
  `);
}

// Routes API
app.get("/api/categories", async (req, res) => {
  const categories = await db.all("SELECT * FROM categories");
  res.json(categories);
});

app.post("/api/categories", async (req, res) => {
  const { name } = req.body;
  await db.run("INSERT INTO categories (name) VALUES (?)", [name]);
  res.status(201).json({ message: "Catégorie ajoutée" });
});

app.get("/api/heats", async (req, res) => {
  const heats = await db.all("SELECT * FROM heats");
  res.json(heats);
});

app.post("/api/heats", async (req, res) => {
  const { name } = req.body;
  await db.run("INSERT INTO heats (name) VALUES (?)", [name]);
  res.status(201).json({ message: "Vague ajoutée" });
});

app.get("/api/teams", async (req, res) => {
  const teams = await db.all(`
    SELECT teams.*, categories.name as category, heats.name as heat
    FROM teams
    LEFT JOIN categories ON teams.category_id = categories.id
    LEFT JOIN heats ON teams.heat_id = heats.id
  `);
  res.json(teams);
});

app.post("/api/teams", async (req, res) => {
  const { name, athlete1, athlete2, category_id, heat_id } = req.body;
  await db.run(
    "INSERT INTO teams (name, athlete1, athlete2, category_id, heat_id) VALUES (?, ?, ?, ?, ?)",
    [name, athlete1, athlete2, category_id, heat_id]
  );
  res.status(201).json({ message: "Équipe ajoutée" });
});

app.put("/api/teams/:id/score", async (req, res) => {
  const { id } = req.params;
  const { score } = req.body;
  await db.run("UPDATE teams SET score = ? WHERE id = ?", [score, id]);
  res.json({ message: "Score mis à jour" });
});

app.delete("/api/teams/:id", async (req, res) => {
  const { id } = req.params;
  await db.run("DELETE FROM teams WHERE id = ?", [id]);
  res.json({ message: "Équipe supprimée" });
});

initDb().then(() => {
  app.listen(port, () => {
    console.log(`Backend running on port ${port}`);
  });
});