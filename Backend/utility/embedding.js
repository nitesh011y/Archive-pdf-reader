import { embeddedClient } from "../config/nvidea_embed.js";

export async function embeddedModel(chunks, input_type) {
  try {
    const response = await embeddedClient.embeddings.create({
      input: chunks,
      model: process.env.EMBED_MODEL || "nvidia/llama-nemotron-embed-1b-v2",
      input_type: input_type,
    });

    // console.log(response.data[0].embedding);
    // console.log("Dimensions:", response.data[0].embedding.length);

    if (response) {
      return await response.data[0].embedding;
    }
  } catch (error) {
    console.error(error);
  }
}
