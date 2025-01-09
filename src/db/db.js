import fs from 'fs/promises';
import path from 'path';

const dbPath = path.resolve('src', 'db');

export const readDB = async (file) => {
  const filePath = path.join(dbPath, file);
  const data = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(data);
};

export const writeDB = async (file, data) => {
  const filePath = path.join(dbPath, file);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
};