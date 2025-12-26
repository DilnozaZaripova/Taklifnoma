import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Handling __dirname for both ESM and CJS if needed, 
// but in current setup with CommonJS it's easier.
const dbPath = path.resolve(process.cwd(), 'data/db.json');

// Ensure data directory exists
const dataDir = path.dirname(dbPath);
const ensureDir = async () => {
  try {
    await fs.mkdir(dataDir, { recursive: true });
  } catch (err) { }
};

class JSONDb {
  public data: any;

  constructor() {
    this.data = { users: [], weddings: [], invitations: [], gifts: [], media: [] };
  }

  async load() {
    try {
      await ensureDir();
      const content = await fs.readFile(dbPath, 'utf-8');
      this.data = JSON.parse(content);
    } catch (err) {
      await this.save();
    }
  }

  async save() {
    await ensureDir();
    await fs.writeFile(dbPath, JSON.stringify(this.data, null, 2));
  }

  async findOne(collection: string, predicate: (item: any) => boolean) {
    await this.load();
    return this.data[collection]?.find(predicate);
  }

  async insert(collection: string, item: any) {
    await this.load();
    if (!this.data[collection]) this.data[collection] = [];
    this.data[collection].push(item);
    await this.save();
    return item;
  }

  async update(collection: string, predicate: (item: any) => boolean, updates: any) {
    await this.load();
    const index = this.data[collection]?.findIndex(predicate);
    if (index !== -1 && index !== undefined) {
      this.data[collection][index] = { ...this.data[collection][index], ...updates };
      await this.save();
    }
  }
}

const db = new JSONDb();
export default db;
export { db };
