"use client";

import React, { useState } from "react";
import { ShieldCheck, FileText, Send, CheckCircle2, Download, Building2, User, Mail, Phone, Film, Sparkles } from "lucide-react";

export function StudioLeadMagnet() {
  const [formData, setFormData] = useState({
    studioName: "",
    contactName: "",
    role: "Producer / Creative Executive",
    email: "",
    phone: "",
    projectTitle: "",
    projectStage: "Screenplay in Development",
    targetPlatform: "Theatrical & Global OTT",
    primaryFocus: "Second-Act Retention & Structural Audit",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.contactName || !formData.studioName) {
      setError("Please fill in your studio name, contact name, and work email.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/studio-diagnostic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to submit inquiry. Please email direct: dr.satish@greybrain.ai");
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Failed to submit. Please contact dr.satish@greybrain.ai directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="studio-diagnostic" className="relative rounded-3xl border border-red-900/40 bg-gradient-to-br from-slate-900 via-slate-950 to-red-950/30 p-8 sm:p-12 shadow-2xl overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-red-600/10 blur-3xl pointer-events-none" />
      <div className="absolute -left-24 -bottom-24 h-96 w-96 rounded-full bg-amber-600/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Value Proposition & Social Proof */}
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-red-400">
            <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
            <span>Studio Advisory Desk</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            The Second Room for Film Studios &amp; OTT Heads.
          </h2>

          <p className="text-slate-300 text-base leading-relaxed">
            Before greenlighting a multimillion-dollar budget or acquiring streaming rights, commission an empirical <strong>7-Layer Diagnostic</strong>, <strong>Morphokinetics Retention Audit</strong>, and <strong>Auteur Craft Profile</strong> under strict bilateral NDA.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-sm text-slate-300">
                <strong>Predictive Second-Act Audit:</strong> Identifies narrative drag, unnecessary subplots, and drop-off risks before shooting.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-sm text-slate-300">
                <strong>Acquisition Due Diligence:</strong> Unvarnished intelligence for Netflix, Prime Video, Hotstar, and theatrical distributors.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-sm text-slate-300">
                <strong>Strict Confidentiality:</strong> All screenplays, bibles, and rough cuts are handled under legally binding bilateral NDAs.
              </p>
            </div>
          </div>

          {/* Sample Dossier Download */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 mt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Sample Executive Diagnostic Dossier</h4>
                <p className="text-xs text-slate-400">15-page comprehensive breakdown of pacing, ROI, and craft.</p>
              </div>
            </div>
            <a
              href="/sample-studio-dossier.pdf"
              download
              className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-red-400 hover:text-red-300 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Specimen Report (PDF)</span>
            </a>
          </div>
        </div>

        {/* Right Column: Interactive Diagnostic Intake Form */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 p-6 sm:p-8 rounded-2xl shadow-xl">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="mx-auto h-16 w-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white">Diagnostic Request Received</h3>
              <p className="text-slate-300 text-sm max-w-md mx-auto">
                Thank you, {formData.contactName}. Our studio editorial team will execute our standard bilateral NDA and contact you at <span className="text-white font-medium">{formData.email}</span> within 12 hours.
              </p>
              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="text-xs text-slate-400 hover:text-slate-200 underline"
                >
                  Submit another project inquiry
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="border-b border-slate-800 pb-3 mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Request Screenplay / Rough-Cut Diagnostic
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Direct engagement with Greybrainer Executive Reviewers.
                </p>
              </div>

              {error && (
                <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-200">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Studio / Production Company *
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                    <input
                      required
                      value={formData.studioName}
                      onChange={(e) => setFormData({ ...formData, studioName: e.target.value })}
                      placeholder="e.g. Amazon Studios, Excel, Mythri"
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 pl-9 pr-3 py-2 text-xs text-white outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Decision Maker Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                    <input
                      required
                      value={formData.contactName}
                      onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                      placeholder="e.g. Creative Producer / VP"
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 pl-9 pr-3 py-2 text-xs text-white outline-none focus:border-red-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Work Email *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="executive@studio.com"
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 pl-9 pr-3 py-2 text-xs text-white outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    WhatsApp / Phone
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                    <input
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 / +1 (Direct Line)"
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 pl-9 pr-3 py-2 text-xs text-white outline-none focus:border-red-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Project Stage
                  </label>
                  <select
                    value={formData.projectStage}
                    onChange={(e) => setFormData({ ...formData, projectStage: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white outline-none focus:border-red-500"
                  >
                    <option>Screenplay in Development</option>
                    <option>Pre-Production / Greenlight Review</option>
                    <option>Rough Cut Screening Audit</option>
                    <option>OTT Platform Acquisition Evaluation</option>
                    <option>Post-Release Forensic Retrospective</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Primary Diagnostic Priority
                  </label>
                  <select
                    value={formData.primaryFocus}
                    onChange={(e) => setFormData({ ...formData, primaryFocus: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white outline-none focus:border-red-500"
                  >
                    <option>Second-Act Retention &amp; Pacing</option>
                    <option>7-Layer Comprehensive Review</option>
                    <option>Morphokinetics Audience Telemetry</option>
                    <option>Auteur / Director Signature Benchmark</option>
                    <option>Commercial Viability &amp; Platform Positioning</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Project Title &amp; Specific Concerns (Optional)
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Working title, target release format, questions on pacing or climax resolution..."
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white outline-none focus:border-red-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 via-red-500 to-amber-600 hover:from-red-500 hover:to-amber-500 py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-red-950/50 transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Processing Request...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Request Confidential Studio Diagnostic (NDA Backed)</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>🔒 Strict NDA Guaranteed</span>
                <span>Response turnaround: &lt; 12 Hours</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
