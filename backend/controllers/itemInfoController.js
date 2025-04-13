import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getItemInfo = async (req, res) => {
  const { itemName } = req.params;

  const itemsPath = path.resolve(__dirname, "../data/items.json");
  const items = JSON.parse(fs.readFileSync(itemsPath, "utf-8"));
  const itemKey = itemName.toLowerCase();
  const item = items[itemKey];

  console.log("Requested item:", itemName);
  console.log("Fetched item:", item);

  if (!item) {
    return res.status(404).json({
      message: `No information found for "${itemName}". Please try another item.`,
    });
  }

  res.json(item);
};