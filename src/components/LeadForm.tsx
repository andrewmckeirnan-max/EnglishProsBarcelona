"use client";

import { useMemo, useState } from "react";
import { areas, visibleCategories, getCategory } from "@/lib/data";
import { getProfessionals } from "@/lib/professionals";
import type { AreaSlug, CategorySlug } from "@/lib/types";
import { businessWaLink } from "@/lib/whatsapp";
import { sentenceLower } from "@/lib/text";
import { ProfessionalCard } from "@/components/ProfessionalCard";

interface LeadFormProps {
  defaultAreaSlug?: AreaSlug;
  defaultCategorySlug?: CategorySlug;
  compact?: boolean;
}

type Urgency = "asap" | "this-week" | "flexible";

const urgencyOptions: { value: Urgency; label: string }[] = [
  { value: "asap", label: "As soon as possible" },
  { value: "this-week", label: "This week" },
  { value: "flexible", label: "I'm flexible" },
];

export function LeadForm({ defaultAreaSlug, defaultCategorySlug, compact }: LeadFormProps) {
  const steps = useMemo(() => {
    const s: string[] = [];
    if (!defaultCategorySlug) s.push("category");
    if (!defaultAreaSlug) s.push("area");
    s.push("need", "urgency", "contact");
    return s;
  }, [defaultAreaSlug, defaultCategorySlug]);

  const [stepIndex, setStepIndex] = useState(0);
  const [categorySlug, setCategorySlug] = useState<CategorySlug | undefined>(defaultCategorySlug);
  const [areaSlug, setAreaSlug] = useState<AreaSlug | undefined>(defaultAreaSlug);
  const [need, setNeed] = useState("");
  const [urgency, setUrgency] = useState<Urgency | "">("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");

  const currentStep = steps[stepIndex];
  const selectedCategory = categorySlug ? getCategory(categorySlug) : undefined;

  function next() {
    setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  }

  async function handleSubmit() {
    if (!categorySlug || !areaSlug) return;
    setStatus("submitting");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          areaSlug,
          categorySlug,
          need,
          urgency: urgency || "flexible",
          name,
          email,
          whatsapp,
          notes,
          pageUrl: typeof window !== "undefined" ? window.location.href : "",
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    const area = areas.find((a) => a.slug === areaSlug);
    const category = categorySlug ? getCategory(categorySlug) : undefined;
    const matches = areaSlug && categorySlug ? getProfessionals(areaSlug, categorySlug) : [];
    const waMessage = `Hi! I just requested help finding ${category ? sentenceLower(category.pluralName) : "a professional"} in ${area?.name ?? "Barcelona"} on BCN English Pros. My name is ${name || "..."}.`;

    // We already have a real listing for this exact area + service — hand it
    // over immediately instead of making someone wait on a "we'll be in
    // touch" promise when the answer is sitting right here.
    if (matches.length > 0) {
      return (
        <div className="rounded-2xl border border-border bg-surface p-6">
          <div className="text-center mb-5">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-light text-2xl">
              ✅
            </div>
            <h3 className="text-lg font-semibold mb-1">Good news — no waiting needed</h3>
            <p className="text-sm text-foreground/70">
              Here&apos;s your full vetted list for {area?.name ?? "your area"} — we&apos;ve also just emailed
              it to {email || "you"} so you don&apos;t lose it. Contact whichever one fits best, directly:
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {matches.map((p) => (
              <ProfessionalCard key={p.id} professional={p} />
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="rounded-2xl border border-border bg-surface p-6 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-light text-2xl">
          ✅
        </div>
        <h3 className="text-lg font-semibold mb-1">Request received</h3>
        <p className="text-sm text-foreground/70 mb-5">
          We don&apos;t have a listed English-speaking {selectedCategory ? sentenceLower(selectedCategory.name) : "professional"} in{" "}
          {areas.find((a) => a.slug === areaSlug)?.name ?? "your area"} yet, so we&apos;ll personally check
          real availability with one nearby and follow up on WhatsApp today.
        </p>
        <a
          href={businessWaLink(waMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] text-white text-sm font-semibold px-5 py-3 hover:opacity-90 transition"
        >
          Message us on WhatsApp now
        </a>
      </div>
    );
  }

  const skipWaMessage = `Hi! I'm looking for ${selectedCategory ? sentenceLower(selectedCategory.pluralName) : "an English-speaking professional"}${areaSlug ? ` in ${areas.find((a) => a.slug === areaSlug)?.name}` : ""} in Barcelona.`;

  return (
    <div className={`rounded-2xl border border-border bg-surface shadow-sm ${compact ? "p-5" : "p-6 sm:p-8"}`}>
      <div className="flex items-center gap-1.5 mb-4">
        {steps.map((s, i) => (
          <div
            key={s}
            className={`h-1.5 flex-1 rounded-full transition-colors ${i <= stepIndex ? "bg-brand" : "bg-border"}`}
          />
        ))}
      </div>

      <a
        href={businessWaLink(skipWaMessage)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-1.5 text-xs font-medium text-[#25D366] hover:underline mb-5"
      >
        Or skip the form — WhatsApp us directly →
      </a>

      {currentStep === "category" && (
        <div>
          <h3 className="text-lg font-semibold mb-4">What do you need help finding?</h3>
          <div className="grid grid-cols-2 gap-2">
            {visibleCategories.map((c) => (
              <button
                key={c.slug}
                onClick={() => {
                  setCategorySlug(c.slug);
                  next();
                }}
                className={`flex items-center gap-2 rounded-xl border px-3 py-3 text-left text-sm hover:border-brand hover:bg-brand-light transition ${
                  categorySlug === c.slug ? "border-brand bg-brand-light" : "border-border"
                }`}
              >
                <span className="text-lg">{c.icon}</span>
                <span className="font-medium">{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {currentStep === "area" && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Which area of Barcelona?</h3>
          <div className="grid grid-cols-2 gap-2">
            {areas.map((a) => (
              <button
                key={a.slug}
                onClick={() => {
                  setAreaSlug(a.slug);
                  next();
                }}
                className={`rounded-xl border px-3 py-3 text-left text-sm hover:border-brand hover:bg-brand-light transition ${
                  areaSlug === a.slug ? "border-brand bg-brand-light" : "border-border"
                }`}
              >
                <span className="font-medium">{a.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {currentStep === "need" && (
        <div>
          <h3 className="text-lg font-semibold mb-4">
            What do you need for your {selectedCategory ? sentenceLower(selectedCategory.name) : "appointment"}?
          </h3>
          <div className="flex flex-col gap-2">
            {(selectedCategory?.needOptions ?? ["Other"]).map((n) => (
              <button
                key={n}
                onClick={() => {
                  setNeed(n);
                  next();
                }}
                className={`rounded-xl border px-4 py-3 text-left text-sm hover:border-brand hover:bg-brand-light transition ${
                  need === n ? "border-brand bg-brand-light" : "border-border"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      )}

      {currentStep === "urgency" && (
        <div>
          <h3 className="text-lg font-semibold mb-4">How soon do you need an appointment?</h3>
          <div className="flex flex-col gap-2">
            {urgencyOptions.map((u) => (
              <button
                key={u.value}
                onClick={() => {
                  setUrgency(u.value);
                  next();
                }}
                className={`rounded-xl border px-4 py-3 text-left text-sm hover:border-brand hover:bg-brand-light transition ${
                  urgency === u.value ? "border-brand bg-brand-light" : "border-border"
                }`}
              >
                {u.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {currentStep === "contact" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <h3 className="text-lg font-semibold mb-1">Where should we send your match?</h3>
          <p className="text-sm text-foreground/60 mb-4">
            We&apos;ll show you the top vetted options right here, plus email you the full list. WhatsApp&apos;s
            for anything else we need to check with you — email means it reaches you either way.
          </p>
          <div className="flex flex-col gap-3">
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="rounded-xl border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
            <input
              required
              type="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="WhatsApp or phone number (e.g. +34 6XX XXX XXX)"
              className="rounded-xl border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="rounded-xl border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Anything else we should know? (optional)"
              rows={2}
              className="rounded-xl border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand resize-none"
            />
          </div>
          {status === "error" && (
            <p className="text-sm text-red-600 mt-3">Something went wrong — please try again.</p>
          )}
          <button
            type="submit"
            disabled={status === "submitting"}
            className="mt-4 w-full rounded-full bg-brand text-white font-semibold py-3 hover:bg-brand-dark transition disabled:opacity-60"
          >
            {status === "submitting" ? "Sending..." : "Find my match"}
          </button>
          <p className="text-xs text-foreground/50 mt-3 text-center">
            No cost to you. We&apos;ll send your vetted list here and to your email — your details aren&apos;t
            shared with any professional unless you choose to contact them.
          </p>
        </form>
      )}

      {currentStep !== "category" && stepIndex > 0 && (
        <button
          onClick={() => setStepIndex((i) => Math.max(i - 1, 0))}
          className="mt-4 text-sm text-foreground/50 hover:text-foreground"
        >
          ← Back
        </button>
      )}
    </div>
  );
}
