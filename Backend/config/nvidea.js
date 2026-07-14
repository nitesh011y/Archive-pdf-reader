import OpenAI from "openai";
import "dotenv/config";

export const openai = new OpenAI({
  apiKey: process.env.API_KEY,
  baseURL: process.env.BASE_URL || "https://integrate.api.nvidia.com/v1",
});
