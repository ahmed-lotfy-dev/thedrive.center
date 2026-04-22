import sharp from "sharp";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)));

async function optimize() {
  console.log("Optimizing with better quality...");
  
  // Desktop - better quality
  await sharp(join(rootDir, "public/active-hero-image.jpg"))
    .resize(1920, 1920, { fit: "inside", withoutEnlargement: false })
    .webp({ quality: 90 })
    .toFile(join(rootDir, "public/active-hero-image.webp"));

  // Mobile - slightly better
  await sharp(join(rootDir, "public/active-hero-image.jpg"))
    .resize(800, 800, { fit: "inside", withoutEnlargement: false })
    .webp({ quality: 80 })
    .toFile(join(rootDir, "public/active-hero-image-mobile.webp"));
  
  console.log("Done!");
}

optimize();