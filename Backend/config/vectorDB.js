// for vector db we are going to use qdrant
import { QdrantClient } from "@qdrant/js-client-rest";

export const qdrant = new QdrantClient({
  url: process.env.QUDRANT_ENDPOINT,
  apiKey: process.env.QUDRANT_API,
});
