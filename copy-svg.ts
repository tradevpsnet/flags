import fs from 'fs/promises';
import path from 'path';

const ICONS_DIR = path.join(process.cwd(), 'src/icons');
const OUT_DIR = path.join(process.cwd(), 'dist/icons/svg');

async function copySVGs(dir: string, relativePath = ''): Promise<void> {
  const files = await fs.readdir(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const relativeFilePath = path.join(relativePath, file);
    const stat = await fs.stat(fullPath);

    if (stat.isDirectory()) {
      await copySVGs(fullPath, relativeFilePath);
    } else if (file.endsWith('.svg')) {
      const outSubDir = path.join(OUT_DIR, relativePath);
      await fs.mkdir(outSubDir, { recursive: true });

      const destPath = path.join(outSubDir, file);
      await fs.copyFile(fullPath, destPath);
    }
  }
}

export async function buildSVGCopy() {
  try {
    await fs.mkdir(OUT_DIR, { recursive: true });
    await copySVGs(ICONS_DIR);
    console.log('SVG icons copied successfully.');
  } catch (error) {
    console.error('Error copying SVGs:', error);
    process.exit(1);
  }
}

