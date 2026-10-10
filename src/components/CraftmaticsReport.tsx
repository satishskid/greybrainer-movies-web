import type { CraftCriterionResult } from '@/lib/articleTypes';

export function CraftmaticsReport({ criteria = [] }: { criteria?: CraftCriterionResult[] }) {
  const rows: CraftCriterionResult[] = [
    ['motivation', 'Character motivation', 'Screenplay / Direction'],
    ['causality', 'Causal coherence', 'Screenplay'],
    ['payoff', 'Setup and payoff', 'Screenplay / Direction'],
    ['dialogue', 'Dialogue function', 'Dialogue / Screenplay'],
    ['continuity', 'Continuity', 'Editing'],
    ['information', 'Information flow', 'Editing / Direction'],
    ['rhythm', 'Rhythm and intent', 'Editing / Direction'],
    ['transitions', 'Transitions', 'Editing'],
  ].map(([id, label, department]) => criteria.find(item => item.id === id) || { id, label, department, score: null, status: 'unscored', contributors: [] });
  return <section className="my-10 border-y border-slate-700 py-8">
    <h2 className="text-2xl font-bold text-white">Craftmatics: the maker’s report card</h2>
    <p className="mt-2 text-sm text-slate-400">Evidence-linked, human-reviewed ordinal scores out of 4. Department attribution is craft responsibility, not an individual rating.</p>
    {!criteria.length && <p className="mt-3 text-sm text-amber-300">Reviewed benchmark data has not been supplied for this article.</p>}
    <div className="mt-6 grid gap-x-8 gap-y-6 md:grid-cols-2">{rows.map(criterion => {
      const scored = criterion.status === 'reviewed' && typeof criterion.score === 'number' && Number.isInteger(criterion.score) && criterion.score >= 0 && criterion.score <= 4 && !!criterion.evidence;
      return <div key={criterion.id} className="border-b border-slate-700 pb-5">
        <div className="flex justify-between gap-4"><h3 className="font-semibold text-white">{criterion.label}</h3><span className="shrink-0 text-teal-300">{scored ? `${criterion.score}/4` : 'Unscored'}</span></div>
        <p className="mt-1 text-xs text-slate-400">{criterion.department}</p>
        <div className="mt-3 h-2 bg-slate-700"><div className="h-full bg-teal-400" style={{ width: scored ? `${criterion.score! * 25}%` : '0%' }} /></div>
        <div className="mt-3 flex flex-wrap gap-3">{(criterion.contributors || []).map(person => <div key={`${person.name}-${person.role}`} className="flex items-center gap-2">{person.portraitUrl?.startsWith('https://') && <img src={person.portraitUrl} alt={person.name} loading="lazy" className="h-10 w-8 object-cover" />}<div><p className="text-xs text-slate-200">{person.name}</p><p className="text-xs text-slate-400">{person.role}</p></div></div>)}</div>
        {scored && <>
          {criterion.mechanism && <p className="mt-3 text-sm leading-6 text-slate-200">{criterion.mechanism}</p>}
          {criterion.improvement && <p className="mt-3 text-sm leading-6"><strong className="text-amber-300">Revision to test: </strong>{criterion.improvement}</p>}
          <details className="mt-3 text-sm text-slate-300"><summary className="cursor-pointer text-teal-300">Evidence, uncertainty and revision test</summary><blockquote className="mt-3 border-l border-slate-500 pl-3">{criterion.evidence}</blockquote><p className="mt-2 text-xs">{criterion.locator}</p>{[['Review rationale', criterion.rationale], ['Preserve', criterion.preserve], ['Trade-off', criterion.tradeOff], ['Comparison test', criterion.test], ['Uncertainty', criterion.uncertainty]].map(([label, value]) => value && <p key={label} className="mt-2"><strong>{label}: </strong>{value}</p>)}</details>
        </>}
      </div>;
    })}</div>
    {criteria.some(item => item.contributors?.length) && <p className="mt-5 text-xs text-slate-400">Credits and portraits: TMDB. This product uses the TMDB API but is not endorsed or certified by TMDB.</p>}
  </section>;
}
