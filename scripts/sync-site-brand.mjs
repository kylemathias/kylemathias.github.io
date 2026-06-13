import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRepo = path.resolve(__dirname, '..');
const brandPath = path.join(webRepo, 'data', 'site-brand.json');
const siteConfigPath = path.join(webRepo, 'js', 'site-config.js');

const META_START = '<!-- site-brand:meta-start -->';
const META_END = '<!-- site-brand:meta-end -->';
const NAV_START = '<!-- site-brand:nav-subtitles-start -->';
const NAV_END = '<!-- site-brand:nav-subtitles-end -->';
const BRAND_START = '// site-brand:generated-start';
const BRAND_END = '// site-brand:generated-end';

const brand = JSON.parse(fs.readFileSync(brandPath, 'utf8'));

function pageKeywords(page) {
  if (page.keywords) return page.keywords;
  let keywords = brand.metaKeywords;
  if (page.keywordsSuffix) {
    keywords = keywords.replace('Kyle Mathias, ', `Kyle Mathias, ${page.keywordsSuffix}`);
  }
  return keywords;
}

function pageDescription(page) {
  if (page.description) return page.description;
  return `${page.descriptionPrefix || ''}${brand.metaDescription}`;
}

function buildStandardMeta(page) {
  const description = pageDescription(page);
  const keywords = pageKeywords(page);
  const title = page.title;
  const ogTitle = page.ogTitle || title;
  const ogUrl = page.ogUrl || brand.siteUrl;
  const twitterUrl = page.twitterUrl || ogUrl;
  const shareImage = brand.shareImage;
  const shareImageAlt = page.shareImageAlt || brand.shareImageAlt;
  const ogDescription = page.ogDescription || description;
  const twitterDescription = page.twitterDescription || ogDescription;
  const twitterTitle = page.twitterTitle || ogTitle;

  return [
    `    <meta name="description" content="${description}">`,
    `    <meta name="keywords" content="${keywords}">`,
    `    <title>${title}</title>`,
    '    <!-- Standard Image Meta Tag -->',
    `    <meta name="image" content="${shareImage}">`,
    '',
    '    <!-- Facebook Meta Tags -->',
    `    <meta property="og:url" content="${ogUrl}">`,
    '    <meta property="og:type" content="website">',
    `    <meta property="og:title" content="${ogTitle}">`,
    `    <meta property="og:description" content="${ogDescription}">`,
    `    <meta property="og:image" content="${shareImage}">`,
    '    <meta property="og:image:width" content="1200">',
    '    <meta property="og:image:height" content="630">',
    `    <meta property="og:image:alt" content="${shareImageAlt}">`,
    '',
    '    <!-- Twitter Meta Tags -->',
    '    <meta name="twitter:card" content="summary_large_image">',
    '    <meta property="twitter:domain" content="kylemathias.com">',
    `    <meta property="twitter:url" content="${twitterUrl}">`,
    `    <meta name="twitter:title" content="${twitterTitle}">`,
    `    <meta name="twitter:description" content="${twitterDescription}">`,
    `    <meta name="twitter:image" content="${shareImage}">`,
    `    <meta name="twitter:image:alt" content="${shareImageAlt}">`,
  ].join('\n');
}

function buildProjectsMeta(page) {
  const shareImage = brand.shareImage;
  return [
    `    <meta name="description" content="${page.description}">`,
    `    <meta name="keywords" content="${page.keywords}">`,
    `    <title>${page.title}</title>`,
    '',
    `    <meta name="image" content="${shareImage}">`,
    `    <meta property="og:url" content="${page.ogUrl}">`,
    '    <meta property="og:type" content="website">',
    `    <meta property="og:title" content="${page.ogTitle}">`,
    `    <meta property="og:description" content="${page.ogDescription}">`,
    `    <meta property="og:image" content="${shareImage}">`,
    '    <meta property="og:image:width" content="1200">',
    '    <meta property="og:image:height" content="630">',
    `    <meta property="og:image:alt" content="${page.shareImageAlt}">`,
    '',
    '    <meta name="twitter:card" content="summary_large_image">',
    '    <meta property="twitter:domain" content="kylemathias.com">',
    `    <meta property="twitter:url" content="${page.twitterUrl}">`,
    `    <meta name="twitter:title" content="${page.ogTitle}">`,
    `    <meta name="twitter:description" content="${page.ogDescription}">`,
    `    <meta name="twitter:image" content="${shareImage}">`,
  ].join('\n');
}

function buildNavSubtitles(indent) {
  return [
    `${indent}<p class="subtitle">${brand.titleLine}</p>`,
    `${indent}<p class="subtitle-skills">${brand.taglineLine}</p>`,
  ].join('\n');
}

function replaceRegion(content, startMarker, endMarker, replacement) {
  const pattern = new RegExp(`${escapeRegExp(startMarker)}[\\s\\S]*?${escapeRegExp(endMarker)}`, 'm');
  const match = content.match(new RegExp(`^(\\s*)${escapeRegExp(startMarker)}`, 'm'));
  const indent = match ? match[1] : '    ';
  if (!pattern.test(content)) {
    throw new Error(`Missing markers: ${startMarker} ... ${endMarker}`);
  }
  return content.replace(pattern, `${startMarker}\n${replacement}\n${indent}${endMarker}`);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildSiteConfigBrand() {
  const fields = [
    ['name', brand.name],
    ['titleLine', brand.titleLine],
    ['taglineLine', brand.taglineLine],
    ['titleFull', brand.titleFull],
    ['metaDescription', brand.metaDescription],
    ['metaKeywords', brand.metaKeywords],
    ['shareImageAlt', brand.shareImageAlt],
    ['siteUrl', brand.siteUrl],
    ['shareImage', brand.shareImage],
  ];

  const lines = ['    brand: {'];
  fields.forEach(([key, value], index) => {
    const suffix = index === fields.length - 1 ? '' : ',';
    lines.push(`        ${key}: ${JSON.stringify(value)}${suffix}`);
  });
  lines.push('    }');
  return lines.join('\n');
}

function syncSiteConfig() {
  let content = fs.readFileSync(siteConfigPath, 'utf8');
  const brandBlock = buildSiteConfigBrand();

  if (content.includes(BRAND_START) && content.includes(BRAND_END)) {
    content = replaceRegion(content, BRAND_START, BRAND_END, brandBlock);
  } else {
    const insertAt = content.indexOf('    // Get all pages that should appear in navigation');
    if (insertAt === -1) throw new Error('Could not find insertion point in site-config.js');
    const wrapped = `    ${BRAND_START}\n${brandBlock},\n    ${BRAND_END}\n\n`;
    content = content.slice(0, insertAt) + wrapped + content.slice(insertAt);
  }

  fs.writeFileSync(siteConfigPath, content);
}

for (const [pageId, page] of Object.entries(brand.pages)) {
  const htmlPath = path.join(webRepo, page.file);
  let content = fs.readFileSync(htmlPath, 'utf8');
  const metaBlock = pageId === 'projects' ? buildProjectsMeta(page) : buildStandardMeta(page);
  const navIndent = pageId === 'index' || pageId === 'projects' ? '            ' : '          ';
  const navBlock = buildNavSubtitles(navIndent);

  content = replaceRegion(content, META_START, META_END, metaBlock);
  content = replaceRegion(content, NAV_START, NAV_END, navBlock);
  fs.writeFileSync(htmlPath, content);
  console.log(`Updated ${page.file}`);
}

syncSiteConfig();
console.log('Updated js/site-config.js');
