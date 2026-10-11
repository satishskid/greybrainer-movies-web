import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Credits & Attribution | Greybrainer', description: 'Sources, image credits and attribution for Greybrainer film analysis.' };

export default function CreditsPage() {
  return <main className="mx-auto min-h-screen max-w-3xl px-6 pb-20 pt-32 text-slate-300">
    <h1 className="text-3xl font-bold text-white">Credits & Attribution</h1>
    <section className="mt-8 border-t border-slate-800 pt-6">
      <h2 className="text-xl font-semibold text-white">The Movie Database</h2>
      <a href="https://www.themoviedb.org" className="my-5 inline-block" aria-label="The Movie Database">
        <img src="/tmdb-logo.svg" alt="TMDB" width="154" height="20" />
      </a>
      <p>This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
      <p className="mt-4">Where indicated, film metadata, credits, posters, backdrops and portraits are sourced through TMDB. Images remain the property of their respective rights holders. Image-specific credits appear with the article.</p>
    </section>
    <section className="mt-8 border-t border-slate-800 pt-6">
      <h2 className="text-xl font-semibold text-white">Greybrainer Analysis</h2>
      <p className="mt-4">Scores and narrative curves are evidence-linked editorial interpretations, not measured audience responses or an independently validated industry benchmark. Craftmatics assessments require an editorial review of the saved evidence; unsupported criteria remain unscored.</p>
    </section>
  </main>;
}
