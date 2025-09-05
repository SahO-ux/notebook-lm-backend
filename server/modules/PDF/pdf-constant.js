import path from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// export const UPLOAD_DIR = path.join(__dirname, "../../uploads");
export const VECTOR_STORE = path.join(__dirname, "../../vector_store.json");

// Ensure dirs exist
// fs.ensureDirSync(UPLOAD_DIR);
