import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import { MorphokineticsWaveform } from './MorphokineticsWaveform';
import { CraftmaticsReport } from './CraftmaticsReport';

test('missing research never produces a fabricated waveform', () => {
  const html = renderToStaticMarkup(<MorphokineticsWaveform movieTitle="Fixture" />);
  assert.ok(html.includes('not available'));
  assert.ok(!html.includes('<svg'));
  assert.ok(!html.includes('Scene 42'));
});
test('saved positions and intensity produce an accessible graph and textual evidence', () => {
  const html = renderToStaticMarkup(<MorphokineticsWaveform movieTitle="Fixture" moments={[{ position: 0.1, intensity: 3, event: 'Opening pressure' }, { position: 0.8, intensity: 9, event: 'Earned confrontation' }]} />);
  assert.ok(html.includes('<svg'));
  assert.ok(html.includes('Earned confrontation'));
  assert.ok(html.includes('not measured audience retention'));
});
test('unreviewed craft proposal is unscored', () => {
  const html = renderToStaticMarkup(<CraftmaticsReport criteria={[{ id: 'motivation', label: 'Character motivation', department: 'Screenplay', status: 'proposal', score: 4, evidence: 'A proposed observation', contributors: [] }]} />);
  assert.ok(html.includes('Unscored'));
  assert.ok(!html.includes('4/4'));
});
