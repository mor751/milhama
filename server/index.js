import express from "express";
import { promises as fs } from "fs";
import path from "path";

const app = express();
const port = process.env.PORT || 4000;

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "dashboard.json");

function defaultData() {
  return {
    categories: [
      {
        value: "situation_report_command",
        label: "חיתוכי מצב רבנות",
        color: "#C4A882",
      },
      {
        value: "situation_report_senior",
        label: "אכ״א",
        color: "#7BA3C9",
      },
      {
        value: "situation_report_logistics",
        label: "הערכת מצב רבצ״ר",
        color: "#C98A8A",
      },
      {
        value: "operations",
        label: "הערכות רחמות",
        color: "#A8A8A8",
      },
    ],
    events: [],
  };
}

async function ensureFile() {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.access(dataFile);
  } catch (error) {
    await fs.writeFile(dataFile, JSON.stringify(defaultData(), null, 2), "utf8");
  }
}

app.use(express.json({ limit: "1mb" }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }
  next();
});

app.get("/api/dashboard", async (req, res) => {
  try {
    await ensureFile();
    const raw = await fs.readFile(dataFile, "utf8");
    const data = raw ? JSON.parse(raw) : defaultData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to read dashboard data." });
  }
});

app.post("/api/dashboard", async (req, res) => {
  try {
    await ensureFile();
    await fs.writeFile(dataFile, JSON.stringify(req.body, null, 2), "utf8");
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to write dashboard data." });
  }
});

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.listen(port, () => {
  console.log(`JSON server listening on http://localhost:${port}`);
});
