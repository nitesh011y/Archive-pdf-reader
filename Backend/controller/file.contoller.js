import { getFile } from "../utility/file.utility.js";
import { embeddedModel } from "../utility/embedding.js";
import { insertIntoQdrant } from "../utility/seed.js";
export const uploadController = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    // Read the PDF
    const textFile = await getFile(file.path);

    // Remove empty pages
    const chunks = textFile.pages.filter((page) => page.text.trim() !== "");

    //make emeddings of chunks
    let embbedings = [];

    for (let chunk of chunks) {
      embbedings.push(await embeddedModel(chunk.text, "passage"));
      // console.log(embbedings);
    }

    const data = await insertIntoQdrant(chunks, embbedings, file.filename);
    if (data.status !== "completed") {
      res.status(501).json("somthing went wrong...");
    }

    res.status(200).json("file upload successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};
