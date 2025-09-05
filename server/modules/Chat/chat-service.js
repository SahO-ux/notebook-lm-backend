import axios from "axios";

const cosineSim = (a, b) => {
  // Similarity Func
  const dot = a.reduce((s, v, i) => s + v * b[i], 0);
  const magA = Math.sqrt(a.reduce((s, v) => s + v * v, 0));
  const magB = Math.sqrt(b.reduce((s, v) => s + v * v, 0));
  return magA && magB ? dot / (magA * magB) : 0;
};

const generateAnswer = async (question, contextText) => {
  const resp = await axios.post(
    // "https://router.huggingface.co/hf-inference/models/sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2/pipeline/sentence-similarity",
    "https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2/pipeline/sentence-similarity",
    {
      inputs: `Context:\n${contextText}\n\nQuestion: ${question}\n\nAnswer:`,
      parameters: { max_new_tokens: 300 },
    },
    { headers: { Authorization: `Bearer ${process.env.HF_API_KEY}` } }
  );

  if (Array.isArray(resp.data) && resp.data[0]?.generated_text) {
    return resp.data[0].generated_text;
  }
  return resp.data.generated_text || "No answer from model";
};

const ChatService = { cosineSim, generateAnswer };
export default { serviceName: "ChatService", ...ChatService };
