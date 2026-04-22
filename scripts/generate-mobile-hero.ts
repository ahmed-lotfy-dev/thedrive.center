import sharp from "sharp";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)));
const inputPath = join(rootDir, "public/active-hero-image.webp");
const outputPath = join(rootDir, "public/active-hero-image-mobile.webp");

async function generate() {
  console.log("Generating mobile variant...");
  
  try {
    await sharp(inputPath)
      .resize(800, 800, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 75 })
      .toFile(outputPath);
    
    console.log("Done! Mobile variant created at:", outputPath);
  } catch (error) {
    console.error("Error:", error);
  }
}

generate();