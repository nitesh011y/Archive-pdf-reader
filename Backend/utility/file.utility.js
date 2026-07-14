import { PDFParse } from "pdf-parse";
import fs from "node:fs";

export async function getFile(path) {
  try {
    const dataBuffer = fs.readFileSync(path);
    const parseFile = new PDFParse({ data: dataBuffer });
    const result = await parseFile.getText();
    return result;
  } catch (error) {
    console.error("Error reading file:", error.message);
  }
}
