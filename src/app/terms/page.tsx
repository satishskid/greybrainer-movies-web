import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of service, editorial conditions, and research use for Greybrainer Movies.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 pb-16 pt-28 text-slate-200">
      <h1 className="text-3xl font-bold text-white">Terms of Service</h1>
      <p className="mt-5 leading-7">
        Welcome to Greybrainer Movies (movies.greybrain.in). By accessing or using our website, articles, and research, you agree to these Terms of Service.
      </p>

      <h2 className="mt-8 text-xl font-semibold text-white">1. Editorial Purpose & Analysis Scope</h2>
      <p className="mt-3 leading-7">
        Greybrainer Movies publishes film analysis, three-layer craft breakdowns, Morphokinetics waveforms, and industry briefings. All content represents editorial interpretation, technical analysis, and craft study. They are not measured audience opinions, commercial warranties, or box-office revenue guarantees.
      </p>

      <h2 className="mt-8 text-xl font-semibold text-white">2. Intellectual Property & Attribution</h2>
      <p className="mt-3 leading-7">
        Original commentary, analytical frameworks, and synthesized briefings are copyright © Greybrainer AI. Where indicated, third-party film stills, titles, and metadata are referenced under fair dealing and commentary standards or sourced via TMDB attribution. All third-party trademarks and cinematic works remain the property of their respective rights holders. See our <Link href="/credits" className="underline text-teal-300">Credits & Attribution</Link> page for source details.
      </p>

      <h2 className="mt-8 text-xl font-semibold text-white">3. Pre-Production & Filmmaker Enquiries</h2>
      <p className="mt-3 leading-7">
        Submitting an enquiry via the Studio Diagnostic form initiates confidential communication for potential craft analysis. Submission does not constitute an engagement or representation agreement. Filmmakers and production houses are advised not to submit unreleased scripts or proprietary treatments until formal terms and non-disclosure agreements are agreed in writing.
      </p>

      <h2 className="mt-8 text-xl font-semibold text-white">4. Acceptable Use</h2>
      <p className="mt-3 leading-7">
        You may read, share, and link to our public articles for personal, academic, or professional discussion with proper attribution to Greybrainer. Automated scraping that disrupts site performance or attempts to bypass rate limits and security controls is strictly prohibited.
      </p>

      <h2 className="mt-8 text-xl font-semibold text-white">5. Privacy & Data Handling</h2>
      <p className="mt-3 leading-7">
        Your use of our website is also governed by our <Link href="/privacy" className="underline text-teal-300">Privacy Policy</Link>, which details our transparent, cookie-optional measurement choices.
      </p>

      <h2 className="mt-8 text-xl font-semibold text-white">6. Contact</h2>
      <p className="mt-3 leading-7">
        For inquiries regarding syndication, licensing, or editorial corrections, contact <a href="mailto:dr.satish@greybrain.ai" className="underline text-teal-300">dr.satish@greybrain.ai</a>.
      </p>
    </main>
  );
}
