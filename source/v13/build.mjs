import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const pages = ['home', 'coaching-emdr', 'scholing', 'online-programmas', 'podcast', 'contact'];
const types = {'.jpg':'image/jpeg', '.png':'image/png', '.gif':'image/gif', '.svg':'image/svg+xml', '.html':'text/html', '.pdf':'application/pdf'};
function embedAssets(html) {
  return html.replace(/(src|href)="(assets\/[^"]+)"/g, (match, attr, file) => {
    const type = types[path.extname(file)];
    if (!type) throw new Error('Unknown asset type: ' + file);
    return `${attr}="data:${type};base64,${fs.readFileSync(path.join(root, file)).toString('base64')}"`;
  });
}
function routeLinks(html, page) {
  return html.replace(/href="(index|coaching-emdr|scholing|online-programmas|podcast|contact)\.html(?:#([^"]+))?"/g,
    (_, file, anchor) => `href="#${file === 'index' ? 'home' : file}${anchor ? '/' + anchor : ''}"`)
    .replace(/href="#([^"]+)"/g, (match, hash) => pages.includes(hash.split('/')[0]) ? match : `href="#${page}/${hash}"`);
}
const home = read('index.html');
const header = home.match(/<header[\s\S]*?<\/header>/)[0];
const footer = home.match(/<footer[\s\S]*?<\/footer>/)[0];
const templates = pages.map(page => {
  const html = read((page === 'home' ? 'index' : page) + '.html');
  const main = html.match(/<main>([\s\S]*?)<\/main>/)[1];
  return `<template id="page-${page}">${embedAssets(routeLinks(main, page))}</template>`;
}).join('\n');
const css = read('assets/styles.css') + '\n' + read('assets/revision-2026-09-06.css');
const html = `<!doctype html><html lang="nl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Just Grow v13 - Calm Studio</title><meta name="description" content="Just Grow: specialistische coaching, EMDR en scholing rond Hyperemesis Gravidarum."><style>${css}</style></head><body class="design-v13" data-design="Calm Studio">${embedAssets(routeLinks(header, 'home'))}<main id="page-mount"></main>${templates}${embedAssets(routeLinks(footer, 'home'))}<script>${read('assets/standalone.js')}</script></body></html>\n`;
const destination = process.argv[2] ? path.resolve(process.argv[2]) : path.resolve(root, '../../just-grow-v13-standalone.html');
fs.writeFileSync(destination, html);
console.log('Built ' + destination);
