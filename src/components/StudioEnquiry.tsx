"use client";

import { useState } from "react";

const CONTACT = "dr.satish@greybrain.ai";

/** Confidential pre-production analysis enquiry: one short form, with email as the fallback. */
export function StudioEnquiry() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setState("sending");
    setError("");
    try {
      const response = await fetch("/api/studio-diagnostic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId: crypto.randomUUID(), email: form.get("email"), studioName: form.get("studio"), serviceInterest: form.get("material") }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok || body.success !== true) throw new Error(body.error || `Your enquiry could not be confirmed. Email ${CONTACT} instead.`);
      setState("sent");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : `Email ${CONTACT} instead.`);
      setState("failed");
    }
  }

  return (
    <section id="studio-diagnostic" aria-labelledby="enquiry-heading" className="scroll-mt-24 border border-slate-700 p-6 sm:p-8">
      <h2 id="enquiry-heading" className="text-2xl font-bold text-white">Working on a film?</h2>
      <p className="mt-3 max-w-2xl leading-7 text-slate-300">
        We apply the same method to a screenplay or rough cut before release, confidentially and under NDA:
        the three-layer assessment, the eight craft criteria with evidence, a pacing interpretation, and revisions to test with their trade-offs.
        It is an informed reading of your material, not a prediction of box office or audience behaviour.
      </p>
      {state === "sent" ? (
        <p role="status" className="mt-5 text-emerald-300">Thank you. We will reply by email.</p>
      ) : (
        <form onSubmit={submit} className="mt-5 grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <label className="text-sm text-slate-300">Work email
            <input name="email" type="email" required autoComplete="email" className="mt-1 w-full border border-slate-600 bg-slate-900 px-3 py-2 text-white" />
          </label>
          <label className="text-sm text-slate-300">Studio or production (optional)
            <input name="studio" autoComplete="organization" className="mt-1 w-full border border-slate-600 bg-slate-900 px-3 py-2 text-white" />
          </label>
          <label className="text-sm text-slate-300 sm:col-span-2">Material
            <select name="material" className="mt-1 w-full border border-slate-600 bg-slate-900 px-3 py-2 text-white">
              <option value="screenplay">Screenplay</option>
              <option value="roughcut">Rough cut</option>
              <option value="other">Something else</option>
            </select>
          </label>
          <button type="submit" disabled={state === "sending"} className="bg-teal-400 px-5 py-2 font-semibold text-slate-950 hover:bg-teal-300 disabled:opacity-50">
            {state === "sending" ? "Sending…" : "Request a confidential analysis"}
          </button>
        </form>
      )}
      {state === "failed" && <p role="alert" className="mt-3 text-sm text-amber-200">{error}</p>}
      <p className="mt-4 text-sm text-slate-400">Or email <a href={`mailto:${CONTACT}?subject=Confidential%20analysis%20enquiry`} className="text-teal-300 underline">{CONTACT}</a>. Please do not send material until we have agreed terms.</p>
    </section>
  );
}
