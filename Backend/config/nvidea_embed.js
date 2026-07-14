import OpenAI from "openai";
import "dotenv/config";

export const embeddedClient = new OpenAI({
  apiKey: process.env.EMBED_API,
  baseURL: process.env.EMBED_BASE_URL || "https://integrate.api.nvidia.com/v1",
});
