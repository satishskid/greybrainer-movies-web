import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import { Navigation } from './Navigation';

test('mobile navigation retains reports, methodology and filmmaker enquiry links', () => {
  const html = renderToStaticMarkup(<Navigation />);
  assert.ok(html.includes('aria-label="Main navigation"'));
  assert.equal((html.match(/href="\/reviews"/g) || []).length, 3);
  assert.equal((html.match(/href="\/#method"/g) || []).length, 2);
  assert.equal((html.match(/href="\/#studio-diagnostic"/g) || []).length, 2);
  assert.ok(html.includes('sm:hidden'));
});
