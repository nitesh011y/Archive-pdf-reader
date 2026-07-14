import { embeddedModel } from "../utility/embedding.js";
import { qdrant } from "../config/vectorDB.js";
import { LLM } from "../utility/llm.utlity.js";

export async function userQueryController(req, res) {
  const { message } = req.body;
  try {
    if (!message || message.trim().length <= 0) {
      return res.status(400).json({ message: "please provide a query" });
    }

    //create message em bedding
    const QueryEmbeded = await embeddedModel(message, "query");

    //get result
    const results = await qdrant.search("pdf_rag", {
      vector: QueryEmbeded,
      // limit: 5,
      // with_payload: true,
      // with_vector: false,
      // filter: {
      //   must: [
      //     {
      //       key: "fileName",
      //       match: {
      //         value: "332b39dd8d275bae62a478c1957c8ed2",
      //       },
      //     },
      //   ],
      // },
    });

    const retrievedChunks = results[0].payload.text;
    //console.log(retrievedChunks);
    let result = await LLM(retrievedChunks, message);

    // console.log(result);
    return res.json({ success: true, message: result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
}
