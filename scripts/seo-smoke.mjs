#!/usr/bin/env node

const args = process.argv.slice(2);
const baseUrlArg = args.find((arg) => arg.startsWith('--base-url='));
const baseUrl = (baseUrlArg?.split('=')[1] || process.env.SEO_BASE_URL || 'http://localhost:3001').replace(/\/$/, '');

const publicRoutes = ['/', '/about', '/contact', '/commitment', '/events', '/equipments'];

function fail(message) {
  console.error(`FAIL ${message}`);
  process.exitCode = 1;
}

function pass(message) {
  console.log(`PASS ${message}`);
}

async function fetchText(path) {
  const response = await fetch(`${baseUrl}${path}`, {
    redirect: 'manual',
  });
  const text = await response.text();
  return { response, text };
}

function hasTitle(html) {
  return /<title>[^<]+<\/title>/i.test(html);
}

function hasCanonical(html) {
  return /<link[^>]+rel=["']canonical["'][^>]+href=["']https?:\/\/[^"']+["']/i.test(html);
}

function hasJsonLd(html) {
  return /<script[^>]+type=["']application\/ld\+json["']/i.test(html);
}

function hasNoindex(html) {
  return /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html);
}

for (const route of publicRoutes) {
  try {
    const { response, text } = await fetchText(route);
    if (!response.ok) {
      fail(`${route} returned ${response.status}`);
      continue;
    }
    if (!hasTitle(text)) fail(`${route} missing title`);
    else pass(`${route} has title`);
    if (!hasCanonical(text)) fail(`${route} missing canonical`);
    else pass(`${route} has canonical`);
    if (!hasJsonLd(text)) fail(`${route} missing JSON-LD`);
    else pass(`${route} has JSON-LD`);
  } catch (error) {
    fail(`${route} fetch failed: ${error.message}`);
  }
}

try {
  const { response, text } = await fetchText('/robots.txt');
  if (!response.ok) fail('/robots.txt did not return 200');
  else pass('/robots.txt reachable');
  if (!/sitemap/i.test(text)) fail('/robots.txt missing sitemap reference');
  else pass('/robots.txt references sitemap');
} catch (error) {
  fail(`/robots.txt fetch failed: ${error.message}`);
}

try {
  const { response, text } = await fetchText('/admin/login');
  if (!response.ok) fail('/admin/login did not return 200');
  else pass('/admin/login reachable');
  if (!hasNoindex(text)) fail('/admin/login missing noindex');
  else pass('/admin/login has noindex');
} catch (error) {
  fail(`/admin/login fetch failed: ${error.message}`);
}

if (process.exitCode) {
  console.error('SEO smoke checks failed.');
} else {
  console.log('SEO smoke checks passed.');
}
