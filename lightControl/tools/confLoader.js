import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const lightConfPath = '../../lightConf/';

function confLoader(confID) {
    const dir = path.resolve(__dirname, lightConfPath);
    const files = fs.readdirSync(dir);
    const matched = files.find((f) => f.startsWith(`${confID}-`));
    if (!matched) return '';
    return fs.readFileSync(path.join(dir, matched), 'utf-8');
}

/* const file = confLoader('0035');
console.log(file);
 */

export { confLoader };