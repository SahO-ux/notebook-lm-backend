import { services } from "../../modulesLoader.js";

const chat = async (req, res) => {
  try {
    const { question, topk = 4 } = req.body || {};
    if (!question) return res.status(400).send({ error: "Missing question" });

    const pdfService = services.PDFService;
    const chatService = services.ChatService;

    const qEmb = (await pdfService.getEmbeddings([question]))[0];

    const scored = pdfService.VECTOR_DB.items.map((item) => ({
      item,
      score: chatService.cosineSim(qEmb, item.embedding),
    }));
    scored.sort((a, b) => b.score - a.score);

    const top = scored.slice(0, topk);
    const contextText = top
      .map((s) => `Page ${s.item.page}: ${s.item.text}`)
      .join("\n---\n");
    const citations = [...new Set(top.map((s) => s.item.page))];

    const answer = await chatService.generateAnswer(question, contextText);

    res.send({ text: answer, citations: citations.map((p) => ({ page: p })) });
  } catch (err) {
    console.error("Chat error:", err.message);
    res.status(500).send({ error: "Failed to answer question" });
  }
};

const ChatController = { chat };
export default { controllerName: "ChatController", ...ChatController };
