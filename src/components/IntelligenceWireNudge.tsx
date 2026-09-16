"use client";

import React, { useState } from "react";
import { Mail, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Users } from "lucide-react";
import { trackFunnelEvent } from "@/lib/analytics";

interface Props {
  variant?: "inline" | "card";
  title?: string;
  subtitle?: string;
}

export function IntelligenceWireNudge({
  variant = "card",
  title = "The Greybrainer Intelligence Wire",
  subtitle = "Weekly narrative failure-mode briefs, second-act retention telemetry, and auteur craft barometers dispatched to 4,200+ studio executives, acquisition heads, and filmmakers.",
}: Props) {
  const [email, setEmail] = useState("");
  const [persona, setPersona] = useState("Studio Executive / Buyer");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setErrorMessage("Please enter a valid work email.");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          persona,
          source: "IntelligenceWireNudge",
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Subscription failed.");
      }

      setStatus("success");
      trackFunnelEvent({
        name: "tofu_wire_subscribed",
        email,
        persona,
      });
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message || "Failed to subscribe. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-6 sm:p-8 text-center backdrop-blur-md transition-all">
        <div className="mx-auto h-12 w-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-3">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h4 className="text-xl font-bold text-white">You're on the Intelligence Wire</h4>
        <p className="text-sm text-slate-300 max-w-md mx-auto mt-2">
          Confirmation sent to <span className="text-white font-semibold">{email}</span>. Expect our upcoming Friday release analysis and second-act diagnostic memo.
        </p>
        <div className="mt-4 text-xs text-slate-400">
          Strictly zero spam. Private executive unsubscribe at any time.
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl border border-red-900/30 bg-gradient-to-br from-slate-900 via-slate-900/90 to-red-950/20 p-6 sm:p-8 backdrop-blur-md shadow-xl ${
        variant === "inline" ? "w-full" : ""
      }`}
    >
      <div className="max-w-4xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Pitch */}
        <div className="lg:max-w-xl space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-red-400">
            <Users className="w-3.5 h-3.5" />
            <span>4,200+ Studio &amp; Industry Readers</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {title}
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            {subtitle}
          </p>

          {/* Persona selector pills */}
          <div className="pt-2 flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 mr-1 text-[11px] font-medium">Your Role:</span>
            {[
              "Studio Executive / Buyer",
              "Screenwriter / Director",
              "Industry Analyst",
            ].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPersona(p)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                  persona === p
                    ? "bg-red-600 text-white shadow-sm"
                    : "bg-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* 1-Field Subscription Input */}
        <div className="w-full lg:w-96 shrink-0">
          <form onSubmit={handleSubmit} className="space-y-2">
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="executive@studio.com or work email"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-10 pr-3 py-3 text-xs sm:text-sm text-white placeholder-slate-500 outline-none focus:border-red-500 shadow-inner"
              />
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 via-red-500 to-amber-600 hover:from-red-500 hover:to-amber-500 py-3 text-xs sm:text-sm font-bold text-white shadow-md shadow-red-950/40 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {status === "loading" ? (
                <span>Subscribing...</span>
              ) : (
                <>
                  <span>Join Intelligence Wire (Free)</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {status === "error" && (
              <p className="text-xs text-red-400 text-center">{errorMessage}</p>
            )}

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>Zero spam guarantee</span>
              </span>
              <span>Dispatched every Friday</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
