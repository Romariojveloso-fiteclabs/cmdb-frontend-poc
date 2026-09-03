import { readdir, rm } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const outputDirectory = fileURLToPath(new URL('../dist/', import.meta.url));

async function removeArchives(directory) {
  const entries = await readdir(directory, { withFileTypes: true });

  await Promise.all(entries.map(async (entry) => {
    const entryPath = join(directory, entry.name);

    if (entry.isDirectory()) {
      await removeArchives(entryPath);
      return;
    }

    if (extname(entry.name).toLowerCase() === '.zip') {
      await rm(entryPath);
    }
  }));
}

await removeArchives(outputDirectory);
