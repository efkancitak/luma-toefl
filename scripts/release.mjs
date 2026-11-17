// Run before every push: stamps the service worker with the fingerprint of the
// cached files. A changed stamp is what makes installed phones fetch the update.
import { readFile, writeFile } from 'node:fs/promises';
import { computeAssetHash, stampedBuild } from './asset-hash.mjs';

const path = new URL('../sw.js', import.meta.url);
const [hash, previous] = await Promise.all([computeAssetHash(), stampedBuild()]);
if (previous === null) throw new Error("sw.js içinde const BUILD = '…' satırı bulunamadı.");
if (previous === hash) {
  console.log(`Değişiklik yok; yayın damgası aynı (${hash}).`);
} else {
  const sw = await readFile(path, 'utf8');
  await writeFile(path, sw.replace(/const BUILD = '[^']*'/, `const BUILD = '${hash}'`));
  console.log(`Yayın damgası güncellendi: ${previous || '—'} → ${hash}. Pushladıktan sonra telefonda "Güncelle" bildirimi çıkar.`);
}
