import path from "path";
import fs from "fs";
import sharp from "sharp";
import * as exifr from "exifr";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

/** Ensure the upload directory exists at startup. */
export function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
}

export interface UploadResult {
  url: string;
  latitude: number | null;
  longitude: number | null;
}

/**
 * Compress an image buffer with sharp and save it to /public/uploads/.
 * Returns the public URL and any GPS coordinates extracted from EXIF data.
 */
export async function processUpload(
  buffer: Buffer,
  originalName: string
): Promise<UploadResult> {
  ensureUploadDir();

  // Extract GPS from EXIF before stripping metadata
  let latitude: number | null = null;
  let longitude: number | null = null;

  try {
    const gps = await exifr.gps(buffer);
    if (gps) {
      latitude = gps.latitude ?? null;
      longitude = gps.longitude ?? null;
    }
  } catch {
    // No EXIF / GPS — that's fine
  }

  const ext = path.extname(originalName).toLowerCase() || ".jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
  const outputPath = path.join(UPLOAD_DIR, filename);

  // Compress: max 1200px wide, quality 80, strip EXIF
  await sharp(buffer)
    .resize({ width: 1200, withoutEnlargement: true })
    .jpeg({ quality: 80 })
    .withMetadata({})
    .toFile(outputPath);

  return {
    url: `/uploads/${filename}`,
    latitude,
    longitude,
  };
}
