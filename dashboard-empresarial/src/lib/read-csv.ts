import path from "path";
import fs from "fs";
import csv from "csv-parser";

export async function readCSVFile() {
  const filePath = path.resolve(process.cwd(), "public", "dados.csv");
  const results: any[] = [];

  return new Promise<any[]>((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (err) => reject(err));
  });
}