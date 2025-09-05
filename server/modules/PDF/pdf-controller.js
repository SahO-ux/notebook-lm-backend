import multer from "multer";

import { services } from "../../modulesLoader.js";

export const controllerName = "PDF";

const storage = multer.memoryStorage();
export const upload = multer({ storage });

// Route handlers
const uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).send({ error: "No file uploaded" });
    const pdfService = services.PDFService;
    const pages = await pdfService.extractPdfPages(req.file.buffer);
    pdfService.VECTOR_DB.items = [];

    for (const p of pages) {
      const chunks = pdfService.chunkText(p.text, 200);
      const embeddings = await pdfService.getEmbeddings(chunks);

      chunks.forEach((chunk, i) => {
        pdfService.VECTOR_DB.items.push({
          id: Date.now() + "-" + Math.round(Math.random() * 1e9),
          text: chunk,
          page: p.pageNumber,
          embedding: embeddings[i],
        });
      });
    }
    pdfService.saveVectorDB();
    res.send({
      ok: true,
      pages: pages.length,
      indexedChunks: pdfService.VECTOR_DB.items.length,
    });
  } catch (err) {
    console.error("Upload error:", err.message);
    res.status(500).send({ error: err.message });
  }
};

export default { controllerName: "PDFController", uploadFile };
