import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const buildPath = (paths) => path.resolve(__dirname, '..', ...paths);
const readFile = (paths) => fs.readFileSync(buildPath(paths), 'utf-8');
const getExtension = (filepath) => path.extname(filepath).substring(1);

export { readFile, buildPath, getExtension };
