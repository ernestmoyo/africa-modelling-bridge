import { useEffect, useMemo, useRef, useState } from 'react';

/**
 * M10 Document Triage — v0.0 demo island.
 *
 * Real back end (v0.5+): Cloudflare Worker → Anthropic API (Claude Sonnet) for
 * synthesis, Haiku for refinement turns. R2 for uploaded PDFs, D1 for audit log,
 * Vectorize for cross-link suggestions, hard per-IP/per-month token caps.
 *
 * v0.0 demo: three curated sample documents with high-fidelity hand-curated
 * outputs. Upload is accepted but processed against a generic fallback output.
 * No real network calls — keeps the prototype shareable without server cost
 * and without exposing the Anthropic key.
 */

type Tier = 'BSc' | 'MSc' | 'PhD';

type Question = {
  tier: Tier;
  title: string;
  rationale: string;
  methods: string[];
  data_needed: string[];
  timeline_months: number;
};

type Output = {
  document_type: string;
  scope: string;
  period: string;
  geography: string;
  key_indicators: string[];
  named_tables: string[];
  programmes: string[];
  questions: Question[];
};

type Sample = {
  id: string;
  country: 'tanzania' | 'malawi' | 'drc';
  flag: string;
  title: string;
  publisher: string;
  year: number;
  size_kb: number;
  output: Output;
};

const samples: Sample[] = [
  {
    id: 'tz-nmcp-2024',
    country: 'tanzania',
    flag: 'TZ',
    title: 'NMCP Annual Performance Report 2024',
    publisher: 'National Malaria Control Programme · Ministry of Health, Tanzania',
    year: 2024,
    size_kb: 4820,
    output: {
      document_type: 'National malaria programme annual performance report',
      scope: 'Programme implementation across 26 regions and 184 councils; surveillance, vector control, case management, supply chain, financing',
      period: 'January–December 2024 fiscal year',
      geography: 'United Republic of Tanzania (mainland and Zanzibar)',
      key_indicators: [
        'Test-positivity rate (TPR) by region and quarter',
        'ITN coverage and use, by region',
        'IRS coverage and pyrethroid-resistance profile by district',
        'ANC1 SP-IPTp coverage',
        'Confirmed cases per 1,000, with under-5 disaggregation',
      ],
      named_tables: [
        'Table 3.2 — TPR trends by region, 2021–2024',
        'Table 4.1 — ITN distribution and post-campaign use by region',
        'Table 5.3 — Confirmed case counts by council, 2024',
        'Annex B — Pyrethroid-resistance bioassay results, sentinel sites',
      ],
      programmes: ['NMCP', 'Vector Control Unit', 'IDSR / surveillance', 'EPI (cross-link)'],
      questions: [
        {
          tier: 'BSc',
          title: 'How well does national-aggregate TPR conceal regional heterogeneity, 2021–2024?',
          rationale:
            'Aggregate TPR is presented as a single national figure each year, but the data in Table 3.2 suggest significant cross-regional spread. A BSc-level decomposition (variance, between-region vs within-region) would give the NMCP a more honest picture for the 2025 strategic-planning cycle.',
          methods: ['Descriptive statistics', 'Variance decomposition', 'Choropleth visualisation'],
          data_needed: ['NMCP annual reports 2021–2024', 'Regional shapefiles (open)'],
          timeline_months: 6,
        },
        {
          tier: 'MSc',
          title:
            'Where in the Lake region will dengue first establish under projected climate change?',
          rationale:
            'The report flags Aedes-borne disease as an emerging IDSR concern but offers no forward-looking risk surface. A spatial-modelling MSc could couple Vector Atlas vector-capacity data with CMIP6 climate projections to identify the districts most likely to support dengue establishment by 2030 and 2050.',
          methods: [
            'Two-stage modelling (mechanism + statistical residual)',
            'Bayesian spatial point process',
            'Climate-projection coupling',
            'Out-of-sample validation',
          ],
          data_needed: [
            'Vector Atlas Aedes occurrence + capacity data',
            'CMIP6 downscaled climate projections',
            'Tanzania IDSR dengue alerts (public summaries)',
          ],
          timeline_months: 10,
        },
        {
          tier: 'PhD',
          title:
            'Joint inference on insecticide resistance and vector control allocation under fiscal contraction',
          rationale:
            'Annex B documents emerging pyrethroid resistance but the report does not formally link resistance trends to vector-control allocation decisions. A PhD-tier joint model could provide the NMCP with an evidence base for a sequenced switch to dual-AI nets across resistance-burdened districts within a constrained 2026–2028 budget envelope.',
          methods: [
            'Mechanism-informed hierarchical Bayesian inference',
            'Decision modelling under uncertainty',
            'Sensitivity analysis on cost-effectiveness frontier',
          ],
          data_needed: [
            'NMCP bioassay results (sentinel sites)',
            'ITN distribution + use by district',
            'Procurement unit-cost data',
          ],
          timeline_months: 30,
        },
      ],
    },
  },
  {
    id: 'mw-epi-2024',
    country: 'malawi',
    flag: 'MW',
    title: 'EPI Annual Bulletin 2024',
    publisher: 'Expanded Programme on Immunisation · Ministry of Health, Malawi',
    year: 2024,
    size_kb: 2640,
    output: {
      document_type: 'National immunisation programme annual bulletin',
      scope: 'EPI coverage, vaccine supply, cold-chain, surveillance, financing — across 28 districts',
      period: '2024 calendar year',
      geography: 'Republic of Malawi',
      key_indicators: [
        'DPT3 coverage by district',
        'Measles second-dose (MCV2) coverage',
        'HPV coverage (adolescent girls)',
        'Cold-chain functional-equipment rate',
        'Co-financing share by donor',
      ],
      named_tables: [
        'Table 2.1 — DPT3 coverage by district, 2020–2024',
        'Table 3.4 — Cold-chain functional-equipment rate by district',
        'Table 5.1 — Co-financing envelope and donor mix, 2022–2026',
      ],
      programmes: ['EPI', 'IDSR (cross-link)', 'Maternal-child health'],
      questions: [
        {
          tier: 'BSc',
          title: 'Which districts have most narrowly cleared the 90% DPT3 coverage threshold over 2020–2024?',
          rationale:
            'Table 2.1 contains every input needed. A BSc-tier descriptive analysis identifying the "margin-of-safety" districts — those whose coverage sits within 3 percentage points of the threshold — would give the ministry a quick-deploy watch list for 2025.',
          methods: ['Descriptive statistics', 'Threshold-margin analysis', 'Choropleth + ranking'],
          data_needed: ['EPI Annual Bulletins 2020–2024', 'District shapefiles'],
          timeline_months: 5,
        },
        {
          tier: 'MSc',
          title:
            'Forecasting district-level EPI coverage drop-out under 2025–26 donor-financing reductions',
          rationale:
            "Table 5.1 documents the contracting donor envelope. Coupled with historical district-level drop-out (Table 2.1) and cold-chain status (Table 3.4), an MSc-tier Bayesian hierarchical forecast can identify the districts most exposed by 2026 — directly informing the ministry's prioritisation decisions.",
          methods: [
            'Bayesian hierarchical model with district random effects',
            'Time-series forecasting',
            'CAR prior on district adjacency',
            'Holdout validation on 2023',
          ],
          data_needed: [
            'EPI Annual Bulletins (5+ years)',
            'DHS Malawi 2015–16, 2023',
            'Co-financing schedules from donors',
          ],
          timeline_months: 8,
        },
        {
          tier: 'PhD',
          title:
            'Causal effect of co-financing volatility on routine immunisation outcomes across sub-Saharan Africa',
          rationale:
            "Malawi's reported drop in co-financing is one of many on the continent. A PhD-tier panel design — Malawi as one country case in a cross-country causal study — would generate evidence beyond Malawi about how donor-volatility translates into coverage loss.",
          methods: [
            'Panel-data causal inference (difference-in-differences with staggered treatment)',
            'Synthetic-control methods',
            'Bayesian meta-analysis across countries',
          ],
          data_needed: [
            'WHO/UNICEF immunisation coverage estimates',
            'Gavi co-financing records',
            'Bilateral disbursement data (OECD CRS)',
          ],
          timeline_months: 36,
        },
      ],
    },
  },
  {
    id: 'drc-pnlp-2024',
    country: 'drc',
    flag: 'CD',
    title: 'Plan Stratégique Annuel — PNLP 2024',
    publisher: 'Programme National de Lutte contre le Paludisme · Ministère de la Santé, RDC',
    year: 2024,
    size_kb: 5680,
    output: {
      document_type: 'Plan stratégique annuel du programme national de lutte contre le paludisme',
      scope: 'Mise en œuvre du programme paludisme sur les 26 provinces et 519 zones de santé',
      period: 'Janvier–Décembre 2024',
      geography: 'République Démocratique du Congo',
      key_indicators: [
        'Incidence paludisme confirmée par zone de santé',
        'Couverture MILD (moustiquaires) et utilisation',
        'CPN/SP-IPTp couverture',
        'Test-and-treat: ratio tests positifs vs traités',
        'Rupture de stock antipaludiques',
      ],
      named_tables: [
        'Tableau 2.3 — Incidence paludisme par zone de santé, périphérie kinoise',
        'Tableau 4.1 — Couverture MILD par province',
        'Annexe C — Profil de résistance aux pyréthrinoïdes',
      ],
      programmes: ['PNLP', 'PEV (cross-link)', 'SNIS / IDSR'],
      questions: [
        {
          tier: 'BSc',
          title:
            'Cartographie de l\'hétérogénéité de l\'incidence du paludisme dans la périphérie kinoise, 2022–2024',
          rationale:
            'Le Tableau 2.3 contient les données suffisantes pour une cartographie au niveau zone-de-santé. Une analyse descriptive de niveau Licence donnerait au PNLP une visualisation actionable pour le planning opérationnel 2025.',
          methods: ['Statistique descriptive', 'Cartographie choroplèthe', 'Analyse de regroupement'],
          data_needed: ['Plans annuels PNLP 2022–2024', 'Limites des zones de santé (publiques)'],
          timeline_months: 6,
        },
        {
          tier: 'MSc',
          title:
            'Allocation optimale des ressources test-and-treat dans la périphérie kinoise sous contrainte budgétaire',
          rationale:
            'Compte tenu de l\'hétérogénéité de transmission (Tableau 2.3) et du budget contraint, une optimisation à variables mixtes au niveau Master peut traduire l\'enveloppe budgétaire 2026 en plan d\'action — directement utilisable par le PNLP.',
          methods: [
            'Programmation linéaire à variables mixtes',
            'Modélisation décisionnelle stochastique',
            'Validation par scénarios contraints',
          ],
          data_needed: [
            'Données de transmission MAP',
            'Données d\'approvisionnement PNLP',
            'Cartes d\'accès Kinshasa',
          ],
          timeline_months: 9,
        },
        {
          tier: 'PhD',
          title:
            'Inférence conjointe sur la résistance aux insecticides et la dynamique de transmission urbaine en RDC',
          rationale:
            'L\'Annexe C documente la résistance émergente mais ne la relie pas formellement à la transmission urbaine. Une thèse de niveau Doctorat couplant modélisation entomologique et inférence bayésienne fournirait au PNLP une base de décision pour les transitions techniques 2026–2030.',
          methods: [
            'Inférence bayésienne hiérarchique informée par mécanisme',
            'Modélisation entomologique',
            'Couplage avec données génomiques (résistance)',
          ],
          data_needed: [
            'Bioessais résistance (sites sentinelles)',
            'Données entomologiques Vector Atlas',
            'Données génomiques publiques',
          ],
          timeline_months: 32,
        },
      ],
    },
  },
];

type Phase = 'idle' | 'reading' | 'analysing' | 'drafting' | 'done';

const phaseCopy: Record<Exclude<Phase, 'idle' | 'done'>, string> = {
  reading: 'Reading the document · extracting text and tables',
  analysing: 'Identifying programmes, indicators and data tables',
  drafting: 'Drafting three candidate research questions',
};

export default function TriageDemo() {
  const [selectedId, setSelectedId] = useState<string>(samples[0].id);
  const [phase, setPhase] = useState<Phase>('idle');
  const [progress, setProgress] = useState(0);
  const [output, setOutput] = useState<Output | null>(null);
  const [uploadName, setUploadName] = useState<string | null>(null);
  const outputRef = useRef<HTMLDivElement | null>(null);

  const selected = useMemo(
    () => samples.find((s) => s.id === selectedId) ?? samples[0],
    [selectedId],
  );

  const isRunning = phase !== 'idle' && phase !== 'done';

  useEffect(() => {
    if (!isRunning) return;
    let cancelled = false;

    const sequence: Array<{ phase: Phase; ms: number; from: number; to: number }> = [
      { phase: 'reading', ms: 1100, from: 0, to: 28 },
      { phase: 'analysing', ms: 1400, from: 28, to: 65 },
      { phase: 'drafting', ms: 1600, from: 65, to: 100 },
    ];

    let elapsed = 0;
    sequence.forEach((step) => {
      const startElapsed = elapsed;
      setTimeout(() => {
        if (cancelled) return;
        setPhase(step.phase);
        setProgress(step.from);
      }, startElapsed);
      // ease progress within the step
      const start = startElapsed;
      const totalSteps = 14;
      for (let i = 1; i <= totalSteps; i++) {
        setTimeout(() => {
          if (cancelled) return;
          const t = i / totalSteps;
          setProgress(step.from + (step.to - step.from) * t);
        }, start + (step.ms * i) / totalSteps);
      }
      elapsed += step.ms;
    });

    setTimeout(() => {
      if (cancelled) return;
      setOutput(selected.output);
      setPhase('done');
      setProgress(100);
      setTimeout(() => outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }, elapsed + 80);

    return () => {
      cancelled = true;
    };
  }, [isRunning, selected]);

  const run = () => {
    setOutput(null);
    setProgress(0);
    setPhase('reading');
  };

  const reset = () => {
    setOutput(null);
    setProgress(0);
    setPhase('idle');
    setUploadName(null);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setUploadName(f.name);
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-[2fr_3fr]">
        {/* Input panel */}
        <div className="rounded-2xl border border-bridge-100 bg-cream-50 p-6 shadow-card">
          <div className="flex items-center justify-between gap-3 mb-4">
            <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-bridge-600">
              1 · Pick a sample
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-ember-500 px-2.5 py-0.5 text-[9px] font-mono uppercase tracking-[0.12em] text-cream-50">
              <span className="h-1.5 w-1.5 rounded-full bg-cream-50 animate-pulse"></span>
              Live · v0.0
            </span>
          </div>
          <div className="space-y-2">
            {samples.map((s) => {
              const active = s.id === selectedId;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setSelectedId(s.id);
                    reset();
                  }}
                  className={[
                    'w-full text-left rounded-xl border p-4 transition-all',
                    active
                      ? 'border-bridge-600 bg-bridge-50 shadow-card'
                      : 'border-bridge-100 bg-cream-50 hover:border-bridge-300 hover:bg-bridge-50/40',
                  ].join(' ')}
                  disabled={isRunning}
                >
                  <div className="flex items-start gap-3">
                    <span className="inline-grid place-items-center h-9 w-9 rounded-md bg-ink-900 font-mono text-[10px] font-medium text-cream-50">
                      {s.flag}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="font-display text-base font-semibold leading-snug text-ink-900 line-clamp-2">
                        {s.title}
                      </div>
                      <div className="mt-1 text-xs text-ink-600 line-clamp-1">{s.publisher}</div>
                      <div className="mt-2 flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.1em] text-ink-400">
                        <span>{s.year}</span>
                        <span>·</span>
                        <span>{s.size_kb} KB · PDF</span>
                      </div>
                    </div>
                    <span
                      aria-hidden="true"
                      className={[
                        'mt-1 h-4 w-4 rounded-full border-2 transition',
                        active ? 'border-bridge-600 bg-bridge-600' : 'border-bridge-200',
                      ].join(' ')}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-5 border-t border-bridge-100 pt-5">
            <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-bridge-600">
              Or upload your own
            </span>
            <label
              htmlFor="amb-triage-upload"
              className="mt-2 flex items-center justify-between gap-3 rounded-lg border border-dashed border-bridge-300 bg-cream-100/40 px-3 py-3 cursor-pointer hover:border-bridge-500 hover:bg-cream-100"
            >
              <span className="text-xs text-ink-600 truncate">
                {uploadName ?? 'Public-domain PDF · ≤10 MB · rate-limit 3/hr'}
              </span>
              <span className="rounded-md bg-bridge-600 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-cream-50">
                Choose file
              </span>
              <input
                id="amb-triage-upload"
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleUpload}
                disabled={isRunning}
              />
            </label>
            <p className="mt-2 text-[10px] leading-relaxed text-ink-400">
              v0.0 prototype: uploads fall back to the selected sample's analysis. Real document
              processing arrives v0.5 with editor review.
            </p>
          </div>
        </div>

        {/* Action / progress panel */}
        <div className="relative overflow-hidden rounded-2xl border border-bridge-100 bg-ink-900 p-6 text-cream-50 shadow-card">
          <div className="grain-overlay opacity-10"></div>
          <div className="relative">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-bridge-200">
                2 · Generate
              </span>
              <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-ember-200">
                Claude Sonnet · Anthropic API
              </span>
            </div>
            <h3 className="mt-3 font-display text-2xl font-semibold leading-tight text-balance">
              Three candidate research questions, in about 30 seconds.
            </h3>
            <p className="mt-2 text-sm text-cream-200/80 max-w-prose">
              Pick a sample on the left. We extract the document, identify the indicators and
              tables, then draft questions at BSc, MSc and PhD tiers — each with methods, data
              needed and timeline.
            </p>

            <div className="mt-6 rounded-xl bg-bridge-800/40 border border-bridge-700 p-4">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 inline-grid place-items-center h-9 w-9 rounded-md bg-ember-500/15 text-ember-200 font-mono text-xs">
                  PDF
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-display text-base font-semibold leading-snug text-cream-50 truncate">
                    {uploadName ?? selected.title}
                  </div>
                  <div className="text-xs text-cream-200/70 truncate">
                    {uploadName ? 'Your upload · processed via fallback to selected sample' : selected.publisher}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              {phase === 'idle' && (
                <button
                  type="button"
                  onClick={run}
                  className="inline-flex items-center gap-2 rounded-lg bg-ember-500 px-5 py-3 text-sm font-medium text-cream-50 shadow-lift hover:bg-ember-600 hover:-translate-y-px transition"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Generate research questions
                </button>
              )}

              {isRunning && (
                <div>
                  <div className="flex items-center gap-3 text-sm text-cream-200">
                    <span className="inline-flex h-2 w-2 rounded-full bg-ember-400 animate-pulse"></span>
                    <span className="font-mono text-xs uppercase tracking-[0.12em]">
                      {phaseCopy[phase as Exclude<Phase, 'idle' | 'done'>]}
                    </span>
                  </div>
                  <div className="mt-3 h-1.5 w-full rounded-full bg-bridge-800/60 overflow-hidden">
                    <div
                      className="h-full bg-ember-500 transition-all duration-200 ease-linear"
                      style={{ width: `${progress.toFixed(0)}%` }}
                    ></div>
                  </div>
                  <p className="mt-2 text-xs text-cream-200/70 font-mono">
                    {progress.toFixed(0)}% · streaming
                  </p>
                </div>
              )}

              {phase === 'done' && (
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={reset}
                    className="inline-flex items-center gap-2 rounded-lg border border-bridge-300/30 px-4 py-2 text-sm text-cream-100 hover:bg-bridge-800/40 transition"
                  >
                    Run again
                  </button>
                  <a
                    href="#triage-output"
                    className="text-xs font-mono uppercase tracking-[0.12em] text-ember-200 hover:text-ember-100"
                  >
                    Jump to output ↓
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Output panel */}
      <div
        ref={outputRef}
        id="triage-output"
        className={[
          'transition-all duration-500',
          output ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none h-0 overflow-hidden',
        ].join(' ')}
      >
        {output && (
          <div className="rounded-2xl border border-bridge-100 bg-cream-50 shadow-card overflow-hidden">
            <div className="border-b border-bridge-100 bg-cream-100/60 px-6 py-4 flex flex-wrap items-center gap-x-6 gap-y-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-bridge-600">
                3 · Output
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-[0.12em] rounded-full bg-cream-200 text-ink-700 px-2 py-0.5">
                AI-generated draft · editor review required
              </span>
              <span className="ml-auto text-[10px] font-mono text-ink-400">
                Claude Sonnet · 1 call · ≈ $0.06 · {selected.flag}
              </span>
            </div>

            <div className="p-6 grid gap-8 md:grid-cols-[2fr_3fr]">
              {/* Document summary */}
              <div>
                <h4 className="font-display text-lg font-semibold text-ink-900">Document summary</h4>
                <dl className="mt-3 space-y-3 text-sm">
                  <SummaryRow label="Type" value={output.document_type} />
                  <SummaryRow label="Scope" value={output.scope} />
                  <SummaryRow label="Period" value={output.period} />
                  <SummaryRow label="Geography" value={output.geography} />
                </dl>
                <div className="mt-5">
                  <div className="eyebrow mb-2">Key indicators</div>
                  <ul className="space-y-1 text-sm text-ink-700">
                    {output.key_indicators.map((k) => (
                      <li key={k} className="flex gap-2">
                        <span className="text-ember-500">▸</span>
                        <span>{k}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-5">
                  <div className="eyebrow mb-2">Named tables</div>
                  <ul className="space-y-1 text-xs font-mono text-ink-600">
                    {output.named_tables.map((t) => (
                      <li key={t}>· {t}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-5">
                  <div className="eyebrow mb-2">Programmes referenced</div>
                  <div className="flex flex-wrap gap-1.5">
                    {output.programmes.map((p) => (
                      <span
                        key={p}
                        className="text-[10px] font-mono uppercase tracking-wider rounded-full bg-bridge-50 text-bridge-700 px-2 py-0.5 border border-bridge-100"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Candidate questions */}
              <div>
                <h4 className="font-display text-lg font-semibold text-ink-900">
                  Candidate research questions
                </h4>
                <div className="mt-3 space-y-4">
                  {output.questions.map((q, i) => (
                    <QuestionCard key={i} q={q} />
                  ))}
                </div>
                <div className="mt-6 rounded-xl border border-dashed border-bridge-200 bg-bridge-50/40 p-4 text-sm text-ink-700">
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-bridge-700">
                    Refinement loop · coming v0.5
                  </span>
                  <p className="mt-1.5 text-ink-700">
                    In v0.5 you'll be able to refine these — <em>"make this MSc-tier"</em>,{' '}
                    <em>"focus on the Lake region"</em>, <em>"add a climate angle"</em> — and watch
                    the questions update in place.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-bridge-100 bg-cream-100/40 px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-[11px] text-ink-500">
              <span>
                Output is an AI-generated draft. In production, editor + adviser review is required
                before any question is published as a dossier.
              </span>
              <a href="/dossiers" className="link-underline text-bridge-700">
                See full dossier examples →
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] font-mono uppercase tracking-[0.14em] text-bridge-600">{label}</dt>
      <dd className="mt-0.5 text-ink-800 leading-snug">{value}</dd>
    </div>
  );
}

function QuestionCard({ q }: { q: Question }) {
  const tierClass: Record<Tier, string> = {
    BSc: 'bg-bridge-100 text-bridge-700 border-bridge-200',
    MSc: 'bg-ember-100 text-ember-700 border-ember-200',
    PhD: 'bg-ink-900 text-cream-50 border-ink-900',
  };
  return (
    <div className="rounded-xl border border-bridge-100 bg-cream-50 p-4 hover:shadow-card transition">
      <div className="flex items-start gap-3">
        <span
          className={[
            'inline-flex items-center justify-center font-mono text-[10px] uppercase tracking-[0.12em] rounded-md border px-2 py-1 whitespace-nowrap',
            tierClass[q.tier],
          ].join(' ')}
        >
          {q.tier} tier
        </span>
        <div className="flex-1 min-w-0">
          <h5 className="font-display text-base font-semibold leading-snug text-ink-900 text-pretty">
            {q.title}
          </h5>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-700">{q.rationale}</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 text-xs">
            <ChipRow label="Methods" items={q.methods} accent="bridge" />
            <ChipRow label="Data needed" items={q.data_needed} accent="ember" />
          </div>
          <div className="mt-2 text-[10px] font-mono uppercase tracking-[0.12em] text-ink-400">
            Timeline · {q.timeline_months} months
          </div>
        </div>
      </div>
    </div>
  );
}

function ChipRow({
  label,
  items,
  accent,
}: {
  label: string;
  items: string[];
  accent: 'bridge' | 'ember';
}) {
  const chip =
    accent === 'bridge'
      ? 'bg-bridge-50 text-bridge-700 border-bridge-100'
      : 'bg-ember-50 text-ember-700 border-ember-100';
  return (
    <div>
      <div className="text-[10px] font-mono uppercase tracking-[0.12em] text-ink-400 mb-1">
        {label}
      </div>
      <div className="flex flex-wrap gap-1">
        {items.map((it) => (
          <span
            key={it}
            className={['rounded-full border px-2 py-0.5 text-[11px] leading-tight', chip].join(' ')}
          >
            {it}
          </span>
        ))}
      </div>
    </div>
  );
}
