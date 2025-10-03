import express from "express";
import cors from "cors";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5177;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

const dataDir = path.join(__dirname, "data");
const dataFile = path.join(dataDir, "banners.json");
const publicDataDir = path.join(__dirname, "..", "public", "backend", "data");
const publicDataFile = path.join(publicDataDir, "banners.json");

function normalizeRecord(entry, idx = 0) {
  const record = { ...entry };
  if (!record.id) {
    record.id = Date.now() + idx;
  }
  if (!record.createdAt) {
    record.createdAt = new Date().toISOString();
  }
  return record;
}

function normalizeList(list) {
  let changed = false;
  const normalized = (Array.isArray(list) ? list : []).map((item, idx) => {
    const result = normalizeRecord(item, idx);
    if (result !== item && (!item?.id || !item?.createdAt)) changed = true;
    return result;
  });
  return { normalized, changed };
}

async function ensureStore() {
  await fs.ensureDir(dataDir);
  const exists = await fs.pathExists(dataFile);
  if (!exists) {
    await fs.writeJson(dataFile, [], { spaces: 2 });
  }
}

async function readStore() {
  await ensureStore();
  try {
    const list = await fs.readJson(dataFile);
    const { normalized, changed } = normalizeList(list);
    if (changed) {
      await writeStore(normalized);
    }
    return normalized;
  } catch {
    return [];
  }
}

async function writeStore(list) {
  await fs.ensureDir(dataDir);
  const { normalized } = normalizeList(list);
  await fs.writeJson(dataFile, normalized, { spaces: 2 });
  // Mirror to public path for visibility if desired
  await fs.ensureDir(publicDataDir);
  // Guardar en público SOLO el esquema minimal que solicitaste
  const publicList = normalized.map((b) => ({
    nombre: b.nombre,
    href: b.href,
    img_src: b.img_src,
    alt: b.alt,
  }));
  await fs.writeJson(publicDataFile, publicList, { spaces: 2 });
}

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.get("/api/banners", async (_req, res) => {
  try {
    const list = await readStore();
    res.json({ ok: true, data: list });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "No se pudo leer el listado de banners" });
  }
});

app.post("/api/banners", async (req, res) => {
  try {
    const { nombre, href = "", img_src, alt = "" } = req.body || {};
    if (!nombre || !img_src) {
      return res
        .status(400)
        .json({ error: "nombre e img_src son obligatorios" });
    }
    const now = new Date().toISOString();
    const record = {
      id: Date.now(),
      nombre,
      href,
      img_src,
      alt,
      createdAt: now,
    };
    const list = await readStore();
    list.push(record);
    await writeStore(list);
    res.status(201).json({ ok: true, data: record });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "No se pudo guardar el banner" });
  }
});

// Sincroniza el backend desde el archivo público minimal
app.post("/api/sync-public", async (_req, res) => {
  try {
    // Leer público
    const pubExists = await fs.pathExists(publicDataFile);
    if (!pubExists) return res.status(404).json({ error: "No existe public/backend/data/banners.json" });
    const publicList = await fs.readJson(publicDataFile);
    if (!Array.isArray(publicList)) return res.status(400).json({ error: "El archivo público no contiene un arreglo válido" });

    // Normalizar al formato completo del backend (id/createdAt si faltan)
    const nowIso = new Date().toISOString();
    const toBackend = publicList.map((b) => ({
      id: b.id || Date.now() + Math.floor(Math.random() * 1000),
      nombre: b.nombre || "",
      href: b.href || "",
      img_src: b.img_src || "",
      alt: b.alt || "",
      createdAt: b.createdAt || nowIso,
    }));

    await writeStore(toBackend);
    res.json({ ok: true, imported: toBackend.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "No se pudo sincronizar desde público" });
  }
});

app.listen(PORT, () => {
  console.log(`[backend] listening on http://127.0.0.1:${PORT}`);
});
