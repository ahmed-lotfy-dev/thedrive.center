import sharp from "sharp";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)));
const inputPath = join(rootDir, "public/active-hero-image.webp");
const outputPath = join(rootDir, "public/active-hero-image.webp");

async function optimize() {
  console.log("Optimizing desktop hero image...");
  
  try {
    await sharp(inputPath)
      .resize(1600, 1600, { fit: "inside", withoutEnlargement: false })
      .webp({ quality: 80 })
      .toFile(outputPath.replace(".webp", "-optimized.webp"));
    
    console.log("Done!");
  } catch (error) {
    console.error("Error:", error);
  }
}

optimize();