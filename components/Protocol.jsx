"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback, useSyncExternalStore } from "react";
import {
  ArrowRight, ArrowLeft, Check, Shield, RotateCcw, FlaskConical,
  Sparkles, Link2, Printer, Clock, GitMerge, ExternalLink,
} from "lucide-react";
import { TIER, GOAL_LABELS, SAFETY_LABEL, INTAKE_GROUPS } from "../data/compounds";
import { QUESTIONS, buildStack, encodeAnswers, decodeAnswers } from "../data/protocol-engine";

/* ------------------------------------------------------------------ *
 *  TNiC · PROTOCOL
 *  A health-signal assessment that resolves into a niche, evidence-
 *  graded supplement stack. Educational, transparent, safety-screened.
 *
 *  Deep-link each card into the live /library/compounds/[slug] pages by setting
 *  LIBRARY_BASE. Empty string disables links (self-contained mode).
 * ------------------------------------------------------------------ */
const LIBRARY_BASE = "/library/compounds";

/* ---------- design tokens ---------- */
const T = {
  void: "#070A12",
  panel: "rgba(255,255,255,0.025)",
  panelHi: "rgba(255,255,255,0.05)",
  line: "rgba(255,255,255,0.08)",
  ink: "#EDF1F8",
  mute: "#7A8299",
  cyan: "#4EE0D3",
  indigo: "#8290F6",
  gold: "#F2C879",
  rose: "#F27A95",
};

/* ---------- ambient molecular field ---------- */
function Field({ intensity }) {
  const ref = useRef(null);
  const reduce = usePrefersReducedMotion();
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext("2d");
    let raf, w, h, nodes, dpr;
    const cols = [T.cyan, T.indigo, T.gold, T.rose];
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = cv.clientWidth; h = cv.clientHeight;
      cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const seed = () => {
      const n = Math.round((w * h) / 26000);
      nodes = Array.from({ length: Math.max(22, Math.min(n, 46)) }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.14, vy: (Math.random() - 0.5) * 0.14,
        r: Math.random() * 1.6 + 0.6, c: cols[(Math.random() * cols.length) | 0],
      }));
    };
    resize(); seed();
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const link = 132 + intensity * 26;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        a.x += a.vx; a.y += a.vy;
        if (a.x < 0 || a.x > w) a.vx *= -1;
        if (a.y < 0 || a.y > h) a.vy *= -1;
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < link) {
            ctx.globalAlpha = (1 - d / link) * (0.12 + intensity * 0.04);
            ctx.strokeStyle = a.c; ctx.lineWidth = 0.6;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        ctx.globalAlpha = 0.55; ctx.fillStyle = a.c;
        ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (!reduce) raf = requestAnimationFrame(draw);
    };
    draw();
    const ro = new ResizeObserver(() => { resize(); seed(); if (reduce) draw(); });
    ro.observe(cv);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [intensity, reduce]);
  return <canvas ref={ref} aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />;
}

const RM_QUERY = "(prefers-reduced-motion: reduce)";
const subscribeRM = (cb) => {
  const m = window.matchMedia(RM_QUERY);
  m.addEventListener?.("change", cb);
  return () => m.removeEventListener?.("change", cb);
};
const noopSubscribe = () => () => {};

function usePrefersReducedMotion() {
  // useSyncExternalStore keeps the media-query subscription without the
  // setState-in-effect the strict react-hooks rule rejects; behavior is unchanged.
  return useSyncExternalStore(subscribeRM, () => window.matchMedia(RM_QUERY).matches, () => false);
}

/* ---------- primitives ---------- */
const Mono = ({ children, style }) => (
  <span style={{ fontFamily: "var(--font-jetbrains-mono), ui-monospace, monospace", ...style }}>{children}</span>
);

function TierDot({ tier, size = 7 }) {
  return <span style={{ width: size, height: size, borderRadius: 99, background: TIER[tier].c, boxShadow: `0 0 10px ${TIER[tier].c}88`, display: "inline-block" }} />;
}

/* =================================================================== */
export default function Protocol() {
  const [step, setStep] = useState(-1); // -1 intro, 0..n questions, "result"
  const [answers, setAnswers] = useState({});
  // `false` during SSR + the first hydration render, then `true`. Same timing as
  // the old mount-effect flag, without the setState-in-effect the linter rejects.
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const total = QUESTIONS.length;

  // Restore a shared/persisted result from ?p= on first mount. Client-only
  // (runs after mount), so this one-time URL restore can't cause an SSR
  // hydration mismatch — hence the scoped set-state-in-effect exemption.
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- see note above */
    try {
      const code = new URLSearchParams(window.location.search).get("p");
      const restored = decodeAnswers(code);
      if (restored && (restored.goals?.length || restored.safety)) {
        setAnswers(restored);
        setStep("result");
      }
    } catch { /* no-op */ }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const result = useMemo(() => (step === "result" ? buildStack(answers) : null), [step, answers]);
  const qIndex = typeof step === "number" && step >= 0 ? step : 0;
  const intensity = step === "result" ? 5 : Math.max(0, qIndex);

  const q = QUESTIONS[qIndex];
  const val = answers[q?.id];

  const next = useCallback(
    () => setStep((s) => (typeof s === "number" && s + 1 < total ? s + 1 : "result")),
    [total]
  );
  const back = () => setStep((s) => (s === "result" ? total - 1 : typeof s === "number" && s > 0 ? s - 1 : -1));
  const restart = () => {
    setAnswers({}); setStep(-1);
    try { window.history.replaceState(null, "", window.location.pathname); } catch {}
  };

  const setSingle = (optId) => {
    setAnswers((a) => ({ ...a, [q.id]: optId }));
    setTimeout(next, 220);
  };
  const toggleMulti = (opt) => {
    setAnswers((a) => {
      const cur = new Set(a[q.id] || []);
      if (opt.clears) return { ...a, [q.id]: cur.has(opt.id) ? [] : [opt.id] };
      cur.delete("none");
      if (cur.has(opt.id)) cur.delete(opt.id);
      else { if (q.max && cur.size >= q.max) return a; cur.add(opt.id); }
      return { ...a, [q.id]: [...cur] };
    });
  };
  const canAdvance = q?.type === "single" ? !!val : true;

  // Keyboard navigation: number keys pick options, arrows move, enter advances
  useEffect(() => {
    if (typeof step !== "number" || step < 0) return;
    const onKey = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      const n = parseInt(e.key, 10);
      if (!Number.isNaN(n) && n >= 1 && n <= q.options.length) {
        const opt = q.options[n - 1];
        if (q.type === "single") setSingle(opt.id);
        else toggleMulti(opt);
        e.preventDefault();
      } else if (e.key === "ArrowRight" || (e.key === "Enter" && q.type === "multi" && canAdvance)) {
        if (canAdvance) { next(); e.preventDefault(); }
      } else if (e.key === "ArrowLeft") {
        back(); e.preventDefault();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step, q, canAdvance, next]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{
      minHeight: "100vh", width: "100%", position: "relative", overflow: "hidden",
      background: `radial-gradient(1200px 700px at 78% -8%, #10203a 0%, transparent 55%), radial-gradient(900px 600px at 8% 108%, #1a1030 0%, transparent 55%), ${T.void}`,
      color: T.ink, fontFamily: "var(--font-inter), system-ui, sans-serif",
    }}>
      <style>{`
        *{box-sizing:border-box}
        ::selection{background:${T.cyan}33}
        .tnic-opt{transition:transform .18s ease, border-color .18s ease, background .18s ease, box-shadow .18s ease}
        .tnic-opt:hover{transform:translateY(-2px)}
        .tnic-opt:focus-visible{outline:2px solid ${T.cyan};outline-offset:2px}
        .tnic-btn:focus-visible{outline:2px solid ${T.cyan};outline-offset:3px}
        .tnic-link{color:inherit;text-decoration:none}
        .tnic-link:hover .tnic-link-name{text-decoration:underline}
        @keyframes rise{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        .rise{animation:rise .5s cubic-bezier(.2,.7,.2,1) both}
        @media (prefers-reduced-motion: reduce){.rise{animation:none}.tnic-opt:hover{transform:none}}
        @media print{
          canvas{display:none!important}
          .tnic-noprint{display:none!important}
          body{background:#fff}
        }
      `}</style>

      <Field intensity={intensity} />

      <div style={{ position: "relative", zIndex: 2, maxWidth: 1120, margin: "0 auto", padding: "clamp(20px,4vw,44px)" }}>
        <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "clamp(28px,6vh,64px)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <FlaskConical size={18} color={T.cyan} strokeWidth={1.6} />
            <Mono style={{ letterSpacing: 3, fontSize: 12, color: T.mute }}>TNiC · PROTOCOL</Mono>
          </div>
          {step !== -1 && (
            <button className="tnic-btn tnic-noprint" onClick={restart} title="Start over"
              style={{ ...ghostBtn, display: "flex", alignItems: "center", gap: 7 }}>
              <RotateCcw size={13} /> <Mono style={{ fontSize: 11 }}>RESET</Mono>
            </button>
          )}
        </header>

        {step === -1 && <Intro onStart={() => setStep(0)} />}
        {typeof step === "number" && step >= 0 && (
          <Question
            key={q.id} q={q} val={val} qIndex={qIndex} total={total}
            onSingle={setSingle} onToggle={toggleMulti}
            onNext={next} onBack={back} canAdvance={canAdvance}
          />
        )}
        {step === "result" && result && (
          <Results result={result} answers={answers} onBack={back} onRestart={restart} hydrated={hydrated} />
        )}

        <Disclaimer />
      </div>
    </div>
  );
}

/* ---------- intro ---------- */
function Intro({ onStart }) {
  return (
    <section className="rise" style={{ maxWidth: 760 }}>
      <Mono style={{ color: T.cyan, fontSize: 12, letterSpacing: 2 }}>EVIDENCE-GRADED · SAFETY-SCREENED</Mono>
      <h1 style={{
        fontFamily: "var(--font-fraunces), Georgia, serif", fontWeight: 500, lineHeight: 1.02,
        fontSize: "clamp(40px,7vw,78px)", letterSpacing: "-0.02em", margin: "18px 0 22px",
      }}>
        Nine questions.<br />
        <span style={{ color: T.mute }}>A stack you can</span>{" "}
        <span style={{ background: `linear-gradient(120deg,${T.cyan},${T.indigo})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          actually defend.
        </span>
      </h1>
      <p style={{ color: T.mute, fontSize: 17, lineHeight: 1.6, maxWidth: 560, marginBottom: 30 }}>
        We map your signals to a niche set of compounds — no laundry list — and grade every
        recommendation by how strong the human evidence really is. Then we screen it against
        what you&apos;re already taking.
      </p>

      <div style={{ display: "flex", gap: 18, flexWrap: "wrap", marginBottom: 38 }}>
        {Object.entries(TIER).map(([k, v]) => (
          <div key={k} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <TierDot tier={k} />
            <Mono style={{ fontSize: 11, color: T.ink }}>{k}</Mono>
            <span style={{ fontSize: 12, color: T.mute }}>· {v.blurb}</span>
          </div>
        ))}
      </div>

      <button className="tnic-btn" onClick={onStart} style={primaryBtn}>
        Begin assessment <ArrowRight size={17} />
      </button>
      <p style={{ color: T.mute, fontSize: 12.5, marginTop: 16 }}>
        ~90 seconds · nothing is saved or sent anywhere · <Mono style={{ fontSize: 11 }}>tip: use number keys</Mono>
      </p>
    </section>
  );
}

/* ---------- question ---------- */
function Question({ q, val, qIndex, total, onSingle, onToggle, onNext, onBack, canAdvance }) {
  const isMulti = q.type === "multi";
  const selected = isMulti ? new Set(val || []) : null;
  const accent = q.safety ? T.rose : T.cyan;

  return (
    <section className="rise">
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 34 }}>
        <Mono style={{ fontSize: 12, color: accent }}>{String(qIndex + 1).padStart(2, "0")}</Mono>
        <div style={{ flex: 1, height: 2, background: T.line, borderRadius: 2, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, width: `${((qIndex + 1) / total) * 100}%`, background: `linear-gradient(90deg,${T.cyan},${T.indigo})`, transition: "width .4s cubic-bezier(.2,.7,.2,1)" }} />
        </div>
        <Mono style={{ fontSize: 12, color: T.mute }}>{String(total).padStart(2, "0")}</Mono>
      </div>

      {q.safety && (
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 12px", borderRadius: 99, border: `1px solid ${T.rose}44`, background: `${T.rose}12`, marginBottom: 18 }}>
          <Shield size={13} color={T.rose} />
          <Mono style={{ fontSize: 11, color: T.rose, letterSpacing: 1 }}>SAFETY SCREEN</Mono>
        </div>
      )}

      <h2 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontWeight: 500, fontSize: "clamp(28px,4.4vw,46px)", letterSpacing: "-0.02em", lineHeight: 1.08, margin: "0 0 10px" }}>
        {q.prompt}
      </h2>
      <p style={{ color: T.mute, fontSize: 15.5, marginBottom: 28, maxWidth: 560 }}>{q.sub}</p>

      <div role={isMulti ? "group" : "radiogroup"} aria-label={q.prompt}
        style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 12 }}>
        {q.options.map((opt, i) => {
          const on = isMulti ? selected.has(opt.id) : val === opt.id;
          const col = q.safety ? T.rose : T.cyan;
          return (
            <button
              key={opt.id} className="tnic-opt rise"
              role={isMulti ? "checkbox" : "radio"} aria-checked={on}
              style={{
                animationDelay: `${i * 40}ms`, textAlign: "left", cursor: "pointer",
                background: on ? `${col}14` : T.panel,
                border: `1px solid ${on ? col : T.line}`,
                borderRadius: 14, padding: "16px 18px", color: T.ink,
                boxShadow: on ? `0 0 0 1px ${col}55, 0 8px 30px -12px ${col}66` : "none",
                display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
              }}
              onClick={() => (isMulti ? onToggle(opt) : onSingle(opt.id))}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 11 }}>
                <Mono aria-hidden="true" style={{ fontSize: 10.5, color: T.mute, border: `1px solid ${T.line}`, borderRadius: 5, padding: "1px 5px", minWidth: 18, textAlign: "center" }}>
                  {i + 1}
                </Mono>
                <span style={{ fontSize: 15.5, fontWeight: on ? 600 : 500 }}>{opt.label}</span>
              </span>
              <span style={{
                width: 20, height: 20, borderRadius: isMulti ? 6 : 99, flexShrink: 0,
                border: `1.5px solid ${on ? col : T.line}`, background: on ? col : "transparent",
                display: "grid", placeItems: "center",
              }}>
                {on && <Check size={13} color={T.void} strokeWidth={3} />}
              </span>
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 30 }}>
        <button className="tnic-btn" onClick={onBack} style={{ ...ghostBtn, display: "flex", alignItems: "center", gap: 7 }}>
          <ArrowLeft size={15} /> Back
        </button>
        {isMulti && (
          <button className="tnic-btn" onClick={onNext} disabled={!canAdvance}
            style={{ ...primaryBtn, opacity: canAdvance ? 1 : 0.4, cursor: canAdvance ? "pointer" : "not-allowed" }}>
            {q.safety ? "Resolve my stack" : (val && val.length ? "Continue" : "Skip")} <ArrowRight size={16} />
          </button>
        )}
        {q.max && isMulti && (
          <Mono style={{ fontSize: 11, color: T.mute, marginLeft: "auto" }}>
            {(val || []).length}/{q.max}
          </Mono>
        )}
      </div>
    </section>
  );
}

/* ---------- results ---------- */
function Results({ result, answers, onBack, onRestart, hydrated }) {
  const { stack, screened, flags, synergyPairs } = result;
  const profile = (answers.goals || []).map((g) => GOAL_LABELS[g]).filter(Boolean);
  const [copied, setCopied] = useState(false);

  // Sync a shareable code into the URL when a result is shown
  useEffect(() => {
    if (!hydrated) return;
    try {
      const code = encodeAnswers(answers);
      const url = `${window.location.pathname}?p=${code}`;
      window.history.replaceState(null, "", url);
    } catch { /* no-op */ }
  }, [answers, hydrated]);

  const share = async () => {
    try {
      const code = encodeAnswers(answers);
      const url = `${window.location.origin}${window.location.pathname}?p=${code}`;
      if (navigator.share) { await navigator.share({ title: "My TNiC protocol", url }); return; }
      await navigator.clipboard.writeText(url);
      setCopied(true); setTimeout(() => setCopied(false), 1800);
    } catch { /* no-op */ }
  };

  const copyText = async () => {
    const lines = [
      "My TNiC Protocol",
      profile.length ? `Optimizing for: ${profile.join(", ")}` : "",
      "",
      ...stack.map((c, i) => `${i + 1}. ${c.name} — ${c.dose} · ${c.timing} [${c.tier}]`),
      "",
      "Educational only — not medical advice. Talk to a clinician before starting anything.",
    ].filter(Boolean);
    try { await navigator.clipboard.writeText(lines.join("\n")); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch {}
  };

  // Group the stack by intake window for a practical "how to take it" schedule
  const schedule = useMemo(() => {
    const g = {};
    stack.forEach((c) => { (g[c.intake] = g[c.intake] || []).push(c); });
    return ["am", "meal", "any", "pm"].filter((k) => g[k]?.length).map((k) => ({ key: k, items: g[k] }));
  }, [stack]);

  return (
    <section className="rise">
      <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 14 }}>
        <Sparkles size={16} color={T.cyan} />
        <Mono style={{ fontSize: 12, letterSpacing: 2, color: T.cyan }}>PROTOCOL RESOLVED</Mono>
      </div>
      <h2 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontWeight: 500, fontSize: "clamp(30px,5vw,52px)", letterSpacing: "-0.02em", lineHeight: 1.05, margin: "0 0 14px" }}>
        Your stack — {stack.length} compound{stack.length > 1 ? "s" : ""}, ranked by fit.
      </h2>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 26 }}>
        {profile.map((p) => (<span key={p} style={pill}>{p}</span>))}
        {flags.map((f) => (
          <span key={f} style={{ ...pill, borderColor: `${T.rose}55`, color: T.rose, background: `${T.rose}12` }}>
            <Shield size={11} style={{ marginRight: 5, verticalAlign: -1 }} />{SAFETY_LABEL[f] || f}
          </span>
        ))}
      </div>

      {/* action bar */}
      <div className="tnic-noprint" style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 30 }}>
        <button className="tnic-btn" onClick={share} style={{ ...ghostBtn, display: "flex", alignItems: "center", gap: 7 }}>
          <Link2 size={14} /> {copied ? "Copied!" : "Share result"}
        </button>
        <button className="tnic-btn" onClick={copyText} style={{ ...ghostBtn, display: "flex", alignItems: "center", gap: 7 }}>
          <Check size={14} /> Copy as text
        </button>
        <button className="tnic-btn" onClick={() => window.print()} style={{ ...ghostBtn, display: "flex", alignItems: "center", gap: 7 }}>
          <Printer size={14} /> Print / PDF
        </button>
      </div>

      <div style={{ display: "grid", gap: 14 }}>
        {stack.map((c, i) => (<CompoundCard key={c.id} c={c} i={i} />))}
      </div>

      {/* synergy notes */}
      {synergyPairs.length > 0 && (
        <div style={{ marginTop: 30, padding: "18px 20px", border: `1px solid ${T.indigo}33`, background: `${T.indigo}0c`, borderRadius: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <GitMerge size={14} color={T.indigo} />
            <Mono style={{ fontSize: 11, letterSpacing: 1.5, color: T.indigo }}>SYNERGIES IN YOUR STACK</Mono>
          </div>
          <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 8 }}>
            {synergyPairs.map(([a, b]) => (
              <li key={a.id + b.id} style={{ color: T.ink, fontSize: 13.5, lineHeight: 1.5 }}>
                <span style={{ color: T.indigo }}>›</span>{" "}
                <strong style={{ fontWeight: 600 }}>{a.name}</strong> + <strong style={{ fontWeight: 600 }}>{b.name}</strong>
                <span style={{ color: T.mute }}> — commonly stacked together; they complement rather than overlap.</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* intake schedule */}
      <div style={{ marginTop: 18, padding: "18px 20px", border: `1px solid ${T.line}`, background: T.panel, borderRadius: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <Clock size={14} color={T.cyan} />
          <Mono style={{ fontSize: 11, letterSpacing: 1.5, color: T.cyan }}>SUGGESTED INTAKE WINDOWS</Mono>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 14 }}>
          {schedule.map(({ key, items }) => (
            <div key={key}>
              <div style={{ fontSize: 13, fontWeight: 600, color: T.ink, marginBottom: 2 }}>{INTAKE_GROUPS[key].label}</div>
              <Mono style={{ fontSize: 10.5, color: T.mute, display: "block", marginBottom: 8 }}>{INTAKE_GROUPS[key].hint}</Mono>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 4 }}>
                {items.map((c) => (
                  <li key={c.id} style={{ fontSize: 13, color: T.mute }}>· {c.name}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {screened.length > 0 && (
        <div style={{ marginTop: 18, padding: "18px 20px", border: `1px solid ${T.rose}33`, background: `${T.rose}0c`, borderRadius: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <Shield size={14} color={T.rose} />
            <Mono style={{ fontSize: 11, letterSpacing: 1.5, color: T.rose }}>HELD BACK FOR YOUR SAFETY</Mono>
          </div>
          <p style={{ color: T.mute, fontSize: 13.5, lineHeight: 1.6, margin: 0 }}>
            {screened.map((s, i) => (
              <span key={s.id}>
                <strong style={{ color: T.ink, fontWeight: 600 }}>{s.name}</strong> would have scored well,
                but is set aside given {s.screenedFor}{i < screened.length - 1 ? "; " : ". "}
              </span>
            ))}
            Discuss these with a clinician rather than self-starting.
          </p>
        </div>
      )}

      <div className="tnic-noprint" style={{ display: "flex", gap: 12, marginTop: 30, flexWrap: "wrap" }}>
        <button className="tnic-btn" onClick={onRestart} style={primaryBtn}>
          <RotateCcw size={15} /> Run it again
        </button>
        <button className="tnic-btn" onClick={onBack} style={{ ...ghostBtn, display: "flex", alignItems: "center", gap: 7 }}>
          <ArrowLeft size={15} /> Adjust answers
        </button>
      </div>
    </section>
  );
}

function CompoundCard({ c, i }) {
  const t = TIER[c.tier];
  const reason = c.reasons.slice(0, 2).join(" and ");
  const href = LIBRARY_BASE && c.slug ? `${LIBRARY_BASE}/${c.slug}` : null;

  const Title = href ? "a" : "div";
  const titleProps = href ? { href, className: "tnic-link" } : {};

  return (
    <article className="rise" style={{
      animationDelay: `${i * 80}ms`, position: "relative", overflow: "hidden",
      background: T.panel, border: `1px solid ${T.line}`, borderRadius: 16, padding: "20px 22px",
    }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: t.c, opacity: 0.9 }} />
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div style={{ minWidth: 220, flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
            <Mono style={{ fontSize: 11, color: T.mute }}>{String(i + 1).padStart(2, "0")}</Mono>
            <Title {...titleProps}>
              <h3 className="tnic-link-name" style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontWeight: 500, fontSize: 21, margin: 0, letterSpacing: "-0.01em", display: "inline-flex", alignItems: "center", gap: 7 }}>
                {c.name}
                {href && <ExternalLink size={13} color={T.mute} />}
              </h3>
            </Title>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 9px", borderRadius: 99, border: `1px solid ${t.c}55`, background: `${t.c}14` }}>
              <TierDot tier={c.tier} size={6} />
              <Mono style={{ fontSize: 10, color: t.c, letterSpacing: 0.5 }}>{c.tier.toUpperCase()}</Mono>
            </span>
            <Mono style={{ fontSize: 10.5, color: T.mute }}>{c.cls}</Mono>
          </div>
          <p style={{ color: T.mute, fontSize: 14, lineHeight: 1.55, margin: "0 0 10px", maxWidth: 620 }}>{c.mech}</p>
          {reason && (
            <p style={{ fontSize: 13.5, color: T.ink, margin: 0 }}>
              <span style={{ color: t.c }}>›</span> Matched for {reason}.
            </p>
          )}
          {c.cautions.length > 0 && (
            <p style={{ fontSize: 12.5, color: T.rose, margin: "8px 0 0", display: "flex", alignItems: "center", gap: 6 }}>
              <Shield size={12} /> Interacts with {c.cautions.map((k) => SAFETY_LABEL[k] || k).join(", ")} — clear with your clinician.
            </p>
          )}
        </div>

        <div style={{ textAlign: "right", minWidth: 150 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4, justifyContent: "flex-end" }}>
            <Mono style={{ fontSize: 26, color: t.c }}>{c.match}</Mono>
            <Mono style={{ fontSize: 12, color: T.mute }}>% fit</Mono>
          </div>
          <div style={{ height: 3, background: T.line, borderRadius: 3, margin: "8px 0 12px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${c.match}%`, background: t.c }} />
          </div>
          <Mono style={{ fontSize: 12, color: T.ink, display: "block" }}>{c.dose}</Mono>
          <Mono style={{ fontSize: 11, color: T.mute, display: "block", marginTop: 3 }}>{c.timing}</Mono>
        </div>
      </div>
    </article>
  );
}

/* ---------- disclaimer ---------- */
function Disclaimer() {
  return (
    <footer style={{ marginTop: 46, paddingTop: 20, borderTop: `1px solid ${T.line}` }}>
      <p style={{ color: T.mute, fontSize: 12, lineHeight: 1.6, maxWidth: 720, margin: 0 }}>
        <Mono style={{ color: T.mute, fontSize: 11 }}>NOTE · </Mono>
        Educational only — not medical advice, diagnosis, or treatment, and not evaluated by the FDA.
        Supplements interact with medications and conditions. Talk to a qualified clinician before starting
        anything, especially if you&apos;re pregnant, nursing, on medication, or managing a health condition.
      </p>
    </footer>
  );
}

/* ---------- shared styles ---------- */
const primaryBtn = {
  display: "inline-flex", alignItems: "center", gap: 9, border: "none", cursor: "pointer",
  background: `linear-gradient(120deg,${T.cyan},${T.indigo})`, color: "#05070d",
  fontFamily: "var(--font-inter), sans-serif", fontWeight: 600, fontSize: 15,
  padding: "13px 22px", borderRadius: 12, boxShadow: `0 12px 34px -14px ${T.cyan}aa`,
};
const ghostBtn = {
  background: "transparent", color: T.mute, border: `1px solid ${T.line}`,
  fontFamily: "var(--font-inter), sans-serif", fontWeight: 500, fontSize: 14,
  padding: "11px 16px", borderRadius: 12, cursor: "pointer",
};
const pill = {
  padding: "6px 12px", borderRadius: 99, border: `1px solid ${T.line}`,
  background: T.panelHi, fontSize: 12.5, color: T.ink,
  fontFamily: "var(--font-jetbrains-mono), monospace",
};
