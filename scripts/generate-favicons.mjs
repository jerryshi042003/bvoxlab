import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { favicons } from 'favicons';

const source = resolve('public/favicon.png');
const outputDir = resolve('public');

const response = await favicons(source, {
  path: '/',
  appName: 'BVOX LAB',
  appShortName: 'BVOX',
  appDescription: 'BVOX LAB creative laboratory.',
  background: '#000000',
  theme_color: '#000000',
  display: 'standalone',
  orientation: 'portrait',
  start_url: '/',
  icons: {
    android: true,
    appleIcon: true,
    appleStartup: false,
    coast: false,
    favicons: true,
    windows: false,
    yandex: false,
  },
});

await Promise.all(
  response.images.map((image) => writeFile(resolve(outputDir, image.name), image.contents)),
);

await Promise.all(
  response.files.map((file) => writeFile(resolve(outputDir, file.name), file.contents)),
);

console.log(`Generated ${response.images.length} images and ${response.files.length} files.`);
