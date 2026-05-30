---
id: M13
name: AI Document Search
family: ai
surface: /tools/search
purpose: Natural-language search over the indexed corpus with citations. Default is citation-list (deterministic); AI synthesis is opt-in.
ship_phase:
  v0_0: Explainer
  v0_5: Embeddings built
  v1_0: Live (citation-list default)
  v1_5: Refined synthesis
is_live_in_v0_0: false
order: 13
---

Default to citation-list mode. Avoids hallucination liability. Every chunk verifiable.
