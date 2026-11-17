// Fingerprint of every file the service worker caches. The service worker's
// BUILD stamp must equal this value, so any change to the app or its content
// produces a new cache and reaches an installed phone.
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);

export async function cachedAssets() {
  const sw = await readFile(new URL('sw.js', root), 'utf8');
  return [...new Set([...sw.matchAll(/'\.\/([^']*)'/g)].map((match) => match[1] || 'index.html'))].sort();
}

export async function computeAssetHash() {
  const hash = createHash('sha256');
  for (const path of await cachedAssets()) {
    hash.update(path);
    hash.update(await readFile(new URL(path, root)));
  }
  return hash.digest('hex').slice(0, 10);
}

export async function stampedBuild() {
  const sw = await readFile(new URL('sw.js', root), 'utf8');
  return sw.match(/const BUILD = '([^']*)'/)?.[1] ?? null;
}
