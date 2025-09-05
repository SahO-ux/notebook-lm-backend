import fs from "fs-extra";
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import axios from "axios";
import { VECTOR_STORE } from "./pdf-constant.js";

let VECTOR_DB = { items: [] }; // In-memory
if (fs.existsSync(VECTOR_STORE)) {
  try {
    VECTOR_DB = fs.readJsonSync(VECTOR_STORE);
  } catch {
    VECTOR_DB = { items: [] };
  }
}
const saveVectorDB = () => {
  fs.writeJsonSync(VECTOR_STORE, VECTOR_DB, { spaces: 2 });
};

// Helpers
const chunkText = (text, maxWords = 200) => {
  const words = text.split(/\s+/);
  const chunks = [];
  for (let i = 0; i < words.length; i += maxWords) {
    const chunk = words.slice(i, i + maxWords).join(" ");
    if (chunk.trim()) chunks.push(chunk);
  }
  return chunks;
};

// Extract PDF text per page
// export const extractPdfPages = async (filePath) => {
//   const dataBuffer = fs.readFileSync(filePath);
//   const data = await pdfParse(dataBuffer);
//   return data.text.split(/\f/).map((txt, i) => ({
//     pageNumber: i + 1,
//     text: txt.trim(),
//   }));
// };

export const extractPdfPages = async (fileBuffer) => {
  const data = await pdfParse(fileBuffer);
  return data.text.split(/\f/).map((txt, i) => ({
    pageNumber: i + 1,
    text: txt.trim(),
  }));
};

// Hugging Face Embeddings
export const getEmbeddings = async (texts) => {
  const results = [];
  const batchSize = 5;
  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);
    const payload = { inputs: batch };

    const resp = await axios.post(
      "https://router.huggingface.co/hf-inference/models/sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2/pipeline/sentence-similarity",
      payload,
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    results.push(...resp.data);
  }
  return results;
};

const PDFService = {
  VECTOR_DB,
  saveVectorDB,
  chunkText,
  extractPdfPages,
  getEmbeddings,
};
export default { serviceName: "PDFService", ...PDFService };
