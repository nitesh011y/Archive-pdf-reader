import { qdrant } from "../config/vectorDB.js";

export async function createCollectionIfNotExists() {
  const collections = await qdrant.getCollections();

  const exists = collections.collections.some(
    (collection) => collection.name === "pdf_rag",
  );

  if (!exists) {
    await qdrant.createCollection("pdf_rag", {
      vectors: {
        size: 2048,
        distance: "Cosine",
      },
    });

    console.log("Collection created.");
  } else {
    console.log("Collection already exists.");
  }
}

export async function insertIntoQdrant(chunks, embbedings, filename) {
  const points = embbedings.map((embedding, index) => ({
    id: index + 1,
    vector: embedding,
    payload: {
      text: chunks[index].text,
      num: chunks[index].num,
      fileName: filename,
    },
  }));

  const data = await qdrant.upsert("pdf_rag", {
    wait: true,
    points,
  });
  return data;
}
