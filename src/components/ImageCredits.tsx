export function ImageCredits({ attribution, imageUrl }: { attribution?: string; imageUrl?: string }) {
  const usesTmdb = /tmdb/i.test(attribution || '') || /^https:\/\/image\.tmdb\.org\//i.test(imageUrl || '');
  if (!attribution && !usesTmdb) return null;
  return <section aria-label="Image credits" className="mt-10 border-t border-slate-800 pt-5 text-xs leading-relaxed text-slate-400">
    <h2 className="mb-2 text-sm font-semibold text-slate-300">Image Credits</h2>
    {attribution && <p>{attribution}</p>}
    {usesTmdb && <a href="https://www.themoviedb.org" className="mt-3 inline-block" aria-label="The Movie Database">
      <img src="/tmdb-logo.svg" alt="TMDB" width="116" height="15" />
    </a>}
    <p className="mt-2"><a href="/credits" className="underline underline-offset-4">Credits and attribution</a></p>
  </section>;
}
