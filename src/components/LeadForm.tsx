"use client";

import { useMemo, useState } from "react";
import { areas, visibleCategories, getCategory } from "@/lib/data";
import { getProfessionals } from "@/lib/professionals";
import { matchEnquiry } from "@/lib/match";
import { FREE_PREVIEW_LIMIT } from "@/lib/constants";
import type { AreaSlug, CategorySlug, Professional } from "@/lib/types";
import { businessWaLink } from "@/lib/whatsapp";
import { sentenceLower } from "@/lib/text";
import { ProfessionalCard } from "@/components/ProfessionalCard";

interface LeadFormProps {
  defaultAreaSlug?: AreaSlug;
  defaultCategorySlug?: CategorySlug;
  compact?: boolean;
}

type Urgency = "asap" | "this-week" | "flexible";

type Screen = "describe" | "category" | "area" | "results" | "details" | "contact";

const urgencyOptions: { value: Urgency; label: string }[] = [
  { value: "asap", label: "As soon as possible" },
  { value: "this-week", label: "This week" },
  { value: "flexible", label: "I'm flexible" },
];

export function LeadForm({ defaultAreaSlug, defaultCategorySlug, compact }: LeadFormProps) {
  // "Describe what you need" only makes sense when we don't already know
  // the service + area (i.e. the general homepage form, not a category
  // page where both are preset).
  const generalEntry = !defaultCategorySlug && !defaultAreaSlug;
  // On a category page, real matches are already shown in the page itself
  // right next to this form, so re-teasing them inside the form would just
  // be a duplicate. Everywhere else (homepage, area page) the form is the
  // only place results get shown, so it teases them before asking for
  // contact details.
  const bothPresetByPage = !!defaultCategorySlug && !!defaultAreaSlug;

  const [screen, setScreen] = useState<Screen>(() => {
    if (generalEntry) return "describe";
    if (!defaultCategorySlug) return "category";
    if (!defaultAreaSlug) return "area";
    return "details";
  });
  const [history, setHistory] = useState<Screen[]>([]);
  const [describeText, setDescribeText] = useState("");
  const [categorySlug, setCategorySlug] = useState<CategorySlug | undefined>(defaultCategorySlug);
  const [areaSlug, setAreaSlug] = useState<AreaSlug | undefined>(defaultAreaSlug);
  const [need, setNeed] = useState("");
  const [urgency, setUrgency] = useState<Urgency | "">("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [notes, setNotes] = useState("");
  // Honeypot: real visitors never see or fill this field (off-screen,
  // unlabeled, skipped in tab order). Bots that fill every input trip it,
  // and the request is silently dropped server-side.
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");

  const selectedCategory = categorySlug ? getCategory(categorySlug) : undefined;
  const matches: Professional[] = categorySlug && areaSlug ? getProfessionals(areaSlug, categorySlug) : [];
  const teaseredMatches = matches.slice(0, FREE_PREVIEW_LIMIT);
  const lockedCount = Math.max(matches.length - FREE_PREVIEW_LIMIT, 0);

  // Roughly what screens this particular form instance can show, just for
  // the progress dots, not the real navigation source of truth.
  const progressScreens = useMemo(() => {
    const s: Screen[] = [];
    if (generalEntry) s.push("describe");
    if (!defaultCategorySlug) s.push("category");
    if (!defaultAreaSlug) s.push("area");
    if (!bothPresetByPage) s.push("results");
    s.push("details", "contact");
    return s;
  }, [generalEntry, defaultCategorySlug, defaultAreaSlug, bothPresetByPage]);

  function goTo(next: Screen) {
    setHistory((h) => [...h, screen]);
    setScreen(next);
  }

  function goBack() {
    setHistory((h) => {
      if (h.length === 0) return h;
      const copy = [...h];
      const prev = copy.pop() as Screen;
      setScreen(prev);
      return copy;
    });
  }

  // Once both category and area are known, decide what to show next: a
  // results teaser if we have real listings to show off (and this form
  // isn't sitting next to an identical list already), otherwise straight
  // to qualifying details.
  function afterCategoryAndArea(catSlug?: CategorySlug, arSlug?: AreaSlug) {
    if (!catSlug) return goTo("category");
    if (!arSlug) return goTo("area");
    const found = getProfessionals(arSlug, catSlug);
    if (!bothPresetByPage && found.length > 0) return goTo("results");
    return goTo("details");
  }

  function handleDescribeSubmit() {
    const match = matchEnquiry(describeText);
    if (match.category) setCategorySlug(match.category.slug);
    if (match.area) setAreaSlug(match.area.slug);
    if (match.need) setNeed(match.need);
    setNotes((prev) => prev || describeText);
    afterCategoryAndArea(match.category?.slug, match.area?.slug);
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
          company: honeypot,
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
    // Carries the full enquiry, not just name + service, since this is the
    // one message a lead might actually send you: when they click, you get
    // urgency and need right in the chat instead of having to cross-reference
    // the email notification.
    const urgencyLabel = urgencyOptions.find((u) => u.value === urgency)?.label;
    const waMessage = [
      `Hi! I just requested help finding ${category ? sentenceLower(category.pluralName) : "a professional"} in ${area?.name ?? "Barcelona"} on Barcelona English Pros.`,
      `Name: ${name || "..."}`,
      need ? `Need: ${need}` : undefined,
      urgencyLabel ? `Urgency: ${urgencyLabel}` : undefined,
    ]
      .filter(Boolean)
      .join("\n");

    if (matches.length > 0) {
      return (
        <div className="rounded-2xl border border-border bg-surface p-6">
          <div className="text-center mb-5">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-light text-2xl">
              🔓
            </div>
            <h3 className="text-lg font-semibold mb-1">Unlocked, here&apos;s your full list</h3>
            <p className="text-sm text-foreground/70">
              We&apos;ve also emailed a copy to {email || "you"} so you don&apos;t lose it. Contact whichever
              one fits best, directly:
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
  const progressIndex = Math.max(progressScreens.indexOf(screen), 0);

  return (
    <div className={`rounded-2xl border border-border bg-surface shadow-sm ${compact ? "p-5" : "p-6 sm:p-8"}`}>
      <div className="flex items-center gap-1.5 mb-4">
        {progressScreens.map((s, i) => (
          <div
            key={s}
            className={`h-1.5 flex-1 rounded-full transition-colors ${i <= progressIndex ? "bg-brand" : "bg-border"}`}
          />
        ))}
      </div>

      {screen !== "results" && (
        <a
          href={businessWaLink(skipWaMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 text-xs font-medium text-[#25D366] hover:underline mb-5"
        >
          Or skip the form, WhatsApp us directly →
        </a>
      )}

      {screen === "describe" && (
        <div>
          <h3 className="text-lg font-semibold mb-1">Describe what you need</h3>
          <p className="text-sm text-foreground/60 mb-4">
            In your own words, we&apos;ll work out the right service and area. Or skip straight to
            picking manually.
          </p>
          <textarea
            autoFocus
            value={describeText}
            onChange={(e) => setDescribeText(e.target.value)}
            placeholder="e.g. I need an English-speaking dentist in Poblenou, my tooth's been killing me and I need someone this week"
            rows={4}
            className="w-full rounded-xl border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand resize-none"
          />
          <button
            onClick={handleDescribeSubmit}
            disabled={!describeText.trim()}
            className="mt-3 w-full rounded-full bg-brand text-white font-semibold py-3 hover:bg-brand-dark transition disabled:opacity-40"
          >
            Show me matches
          </button>
          <button
            onClick={() => goTo("category")}
            className="mt-2 w-full text-center text-sm text-foreground/50 hover:text-foreground"
          >
            Or choose manually instead
          </button>
        </div>
      )}

      {screen === "category" && (
        <div>
          <h3 className="text-lg font-semibold mb-4">What do you need help finding?</h3>
          <div className="grid grid-cols-2 gap-2">
            {visibleCategories.map((c) => (
              <button
                key={c.slug}
                onClick={() => {
                  setCategorySlug(c.slug);
                  afterCategoryAndArea(c.slug, areaSlug);
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

      {screen === "area" && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Which area of Barcelona?</h3>
          <div className="grid grid-cols-2 gap-2">
            {areas.map((a) => (
              <button
                key={a.slug}
                onClick={() => {
                  setAreaSlug(a.slug);
                  afterCategoryAndArea(categorySlug, a.slug);
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

      {screen === "results" && (
        <div>
          <h3 className="text-lg font-semibold mb-1">
            {matches.length} match{matches.length === 1 ? "" : "es"} found near {areas.find((a) => a.slug === areaSlug)?.name}
          </h3>
          <p className="text-sm text-foreground/60 mb-4">
            {lockedCount > 0
              ? `Here are ${teaseredMatches.length}, real and verified. Add your details to unlock the other ${lockedCount}, ranked with contact details.`
              : "Real and verified. Add your details and we'll connect you directly, plus keep a copy in your inbox."}
          </p>
          <div className="flex flex-col gap-3">
            {teaseredMatches.map((p) => (
              <ProfessionalCard key={p.id} professional={p} />
            ))}
            {lockedCount > 0 && (
              <div className="rounded-xl border border-dashed border-border bg-surface-muted p-4 text-center">
                <p className="text-sm font-medium">🔒 {lockedCount} more matched nearby</p>
              </div>
            )}
          </div>
          <button
            onClick={() => goTo("details")}
            className="mt-4 w-full rounded-full bg-brand text-white font-semibold py-3 hover:bg-brand-dark transition"
          >
            {lockedCount > 0 ? `Unlock all ${matches.length}` : "Get connected"}
          </button>
        </div>
      )}

      {screen === "details" && (
        <div>
          <h3 className="text-lg font-semibold mb-4">A couple of quick details</h3>
          {(selectedCategory?.needOptions?.length ?? 0) > 0 && (
            <div className="mb-5">
              <p className="text-sm font-medium mb-2">
                What do you need for your {selectedCategory ? sentenceLower(selectedCategory.name) : "appointment"}?
              </p>
              <div className="flex flex-wrap gap-2">
                {(selectedCategory?.needOptions ?? []).map((n) => (
                  <button
                    key={n}
                    onClick={() => setNeed(n)}
                    className={`rounded-full border px-3 py-1.5 text-sm hover:border-brand hover:bg-brand-light transition ${
                      need === n ? "border-brand bg-brand-light" : "border-border"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div>
            <p className="text-sm font-medium mb-2">How soon do you need an appointment?</p>
            <div className="flex flex-col gap-2">
              {urgencyOptions.map((u) => (
                <button
                  key={u.value}
                  onClick={() => setUrgency(u.value)}
                  className={`rounded-xl border px-4 py-3 text-left text-sm hover:border-brand hover:bg-brand-light transition ${
                    urgency === u.value ? "border-brand bg-brand-light" : "border-border"
                  }`}
                >
                  {u.label}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => goTo("contact")}
            disabled={!urgency}
            className="mt-4 w-full rounded-full bg-brand text-white font-semibold py-3 hover:bg-brand-dark transition disabled:opacity-40"
          >
            Continue
          </button>
        </div>
      )}

      {screen === "contact" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <h3 className="text-lg font-semibold mb-1">
            {matches.length > 0 ? "Where should we send the full list?" : "Where should we send your match?"}
          </h3>
          <p className="text-sm text-foreground/60 mb-4">
            WhatsApp&apos;s the fast lane, we&apos;ll follow up there first. Email&apos;s required as a
            backup so you never lose your match if you miss a message.
          </p>
          <div className="flex flex-col gap-3">
            <input
              type="text"
              name="company"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute -left-[9999px] w-px h-px opacity-0"
            />
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
            <p className="text-sm text-red-600 mt-3">Something went wrong, please try again.</p>
          )}
          <button
            type="submit"
            disabled={status === "submitting"}
            className="mt-4 w-full rounded-full bg-brand text-white font-semibold py-3 hover:bg-brand-dark transition disabled:opacity-60"
          >
            {status === "submitting" ? "Sending..." : matches.length > 0 ? "Unlock my full list" : "Find my match"}
          </button>
          <p className="text-xs text-foreground/50 mt-3 text-center">
            Free, always, for the Barcelona English-speaking community. We&apos;re paid by
            professionals who want to be found by you, never by you. Your details aren&apos;t shared
            with any professional unless you choose to contact them.
          </p>
        </form>
      )}

      {history.length > 0 && (
        <button onClick={goBack} className="mt-4 text-sm text-foreground/50 hover:text-foreground">
          ← Back
        </button>
      )}
    </div>
  );
}
