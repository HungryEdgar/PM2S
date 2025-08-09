import express from 'express';
import cors from 'cors';
import { promises as fs } from 'fs';
import path from 'path';

const app = express();
app.use(cors());
app.use(express.json());

const dataDir = path.resolve(__dirname, 'data');

async function readJson<T>(file: string): Promise<T> {
  const filePath = path.join(dataDir, file);
  const content = await fs.readFile(filePath, 'utf8');
  return JSON.parse(content) as T;
}

async function writeJson(file: string, data: unknown): Promise<void> {
  const filePath = path.join(dataDir, file);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

// Devices endpoints
app.get('/devices', async (_req, res) => {
  try {
    const devices = await readJson<unknown[]>('devices.json');
    res.json(devices);
  } catch {
    res.status(500).json({ error: 'Failed to read devices' });
  }
});

interface StoredDevice { id: string; [key: string]: unknown }

app.post('/devices', async (req, res) => {
  try {
    const newDevice = req.body;
    const devices = await readJson<StoredDevice[]>('devices.json');
    const index = devices.findIndex(d => d.id === newDevice.id);
    if (index >= 0) {
      devices[index] = newDevice;
    } else {
      devices.push(newDevice);
    }
    await writeJson('devices.json', devices);
    res.json(devices);
  } catch {
    res.status(500).json({ error: 'Failed to save device' });
  }
});

app.delete('/devices/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const devices = await readJson<StoredDevice[]>('devices.json');
    const filtered = devices.filter(d => d.id !== id);
    await writeJson('devices.json', filtered);
    res.json(filtered);
  } catch {
    res.status(500).json({ error: 'Failed to delete device' });
  }
});

// Decision tree endpoints
app.get('/decision-trees', async (_req, res) => {
  try {
    const trees = await readJson<Record<string, unknown>>('decisionTrees.json');
    res.json(trees);
  } catch {
    res.status(500).json({ error: 'Failed to read decision trees' });
  }
});

app.post('/decision-trees', async (req, res) => {
  try {
    const tree = req.body;
    const trees = await readJson<Record<string, unknown>>('decisionTrees.json');
    (trees as Record<string, unknown>)[tree.deviceId] = tree;
    await writeJson('decisionTrees.json', trees);
    res.json(trees);
  } catch {
    res.status(500).json({ error: 'Failed to save decision tree' });
  }
});

app.delete('/decision-trees/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const trees = await readJson<Record<string, unknown>>('decisionTrees.json');
    delete (trees as Record<string, unknown>)[id];
    await writeJson('decisionTrees.json', trees);
    res.json(trees);
  } catch {
    res.status(500).json({ error: 'Failed to delete decision tree' });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
