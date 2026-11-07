import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Privacy and optional analytics choices for Greybrainer Movies.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return <main className="mx-auto w-full max-w-3xl px-6 pb-16 pt-28 text-slate-200">
    <h1 className="text-3xl font-bold text-white">Privacy</h1>
    <p className="mt-5 leading-7">Greybrainer Movies publishes film research at movies.greybrain.in. You can read it without accepting optional analytics.</p>
    <h2 className="mt-8 text-xl font-semibold">Optional analytics</h2>
    <p className="mt-3 leading-7">If you accept analytics, Google Tag Manager loads Google Analytics to help us understand visits and readership. Google may process browser, device, page and network information and use analytics cookies. We do not intentionally send enquiry form contents to analytics. Marketing tracking, including Meta Pixel, is not enabled in this rollout.</p>
    <p className="mt-3 leading-7">Use Privacy choices at the bottom of any page to accept or reject analytics. Your choice is stored in this browser. Withdrawal reloads the page to stop loading analytics; it does not erase information already received by Google or automatically remove previously set cookies. You can remove those through your browser settings.</p>
    <p className="mt-3 leading-7">With analytics consent, a confirmed analysis enquiry can also be counted as a filmmaker enquiry. This event contains a fixed category, not your email, studio name, message or private receipt number. Without consent, your enquiry still works and no enquiry event is queued.</p>
    <h2 className="mt-8 text-xl font-semibold">Enquiries and essential processing</h2>
    <p className="mt-3 leading-7">When you request a confidential analysis, we receive your email, optional studio name and selected service so we can respond. These are stored separately from public articles. Cloudflare hosts the site and processes technical request information needed to deliver and secure it. Do not submit confidential scripts until terms are agreed.</p>
    <h2 className="mt-8 text-xl font-semibold">Contact and requests</h2>
    <p className="mt-3 leading-7">For questions or a request about enquiry information, email <a href="mailto:dr.satish@greybrain.ai" className="underline">dr.satish@greybrain.ai</a>. Third-party social links are governed by the privacy policies of those services.</p>
    <p className="mt-6"><a href="https://policies.google.com/privacy" className="underline">Google privacy policy</a></p>
  </main>;
}
