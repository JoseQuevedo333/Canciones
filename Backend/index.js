import express from "express";
import { writeFile, readFile } from "node:fs/promises";
import cors from "cors";
import bodyParser from "body-parser";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const CANCIONES_PATH = join(__dirname, "canciones.json");

async function leerCanciones() {
  try {
    const data = await readFile(CANCIONES_PATH, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function guardarCanciones(canciones) {
  await writeFile(CANCIONES_PATH, JSON.stringify(canciones, null, 2));
}

app.get("/canciones", async (req, res) => {
  const canciones = await leerCanciones();
  res.json(canciones);
});

app.post("/canciones", async (req, res) => {
  const nuevaCancion = req.body;
  const canciones = await leerCanciones();
  canciones.push(nuevaCancion);
  await guardarCanciones(canciones);
  res.status(201).json(nuevaCancion);
});

app.put("/canciones/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { titulo, artista, tono } = req.body;

  let canciones = await leerCanciones();
  let found = false;
  canciones = canciones.map(c => {
    if (Number(c.id) === id) {
      found = true;
      return { id, titulo, artista, tono };
    }
    return c;
  });

  if (!found) return res.status(404).json({ message: "Canción no encontrada" });

  await guardarCanciones(canciones);
  res.json({ message: "Canción actualizada" });
});

app.delete("/canciones/:id", async (req, res) => {
  const id = Number(req.params.id);
  let canciones = await leerCanciones();
  canciones = canciones.filter(c => Number(c.id) !== id);
  await guardarCanciones(canciones);
  res.json({ message: "Canción eliminada" });
});

// Servir frontend estático
app.use(express.static(join(__dirname, "..", "Frontend")));

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "..", "Frontend", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
