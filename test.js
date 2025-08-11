import { dirname, join } from "path";
import { fileURLToPath } from "url";
const imagesPath = join(dirname(fileURLToPath(import.meta.url)), "../images");
console.log(imagesPath);
