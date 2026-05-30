import { defineCollection, z } from 'astro:content';

const modules = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.string(),
    name: z.string(),
    family: z.enum(['data', 'people', 'ai', 'ops']),
    surface: z.string(),
    purpose: z.string(),
    ship_phase: z.object({
      v0_0: z.string(),
      v0_1: z.string().optional(),
      v0_5: z.string().optional(),
      v1_0: z.string().optional(),
      v1_5: z.string().optional(),
    }),
    is_live_in_v0_0: z.boolean().default(false),
    order: z.number(),
  }),
});

const countries = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    region: z.string(),
    languages: z.array(z.string()),
    anchor: z.object({
      name: z.string(),
      role: z.string(),
      placeholder: z.boolean().default(false),
    }),
    summary: z.string(),
  }),
});

const researchers = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    role: z.string(),
    institution: z.string().optional(),
    country: z.string().optional(),
    methods: z.array(z.string()).default([]),
    photo: z.string().optional(),
    bio: z.string(),
    placeholder: z.boolean().default(false),
    links: z
      .object({
        orcid: z.string().optional(),
        github: z.string().optional(),
        x: z.string().optional(),
        linkedin: z.string().optional(),
      })
      .optional(),
    open_to_support: z.boolean().default(false),
    spotlight: z.boolean().default(false),
  }),
});

const dossiers = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    country: z.enum(['tanzania', 'malawi', 'drc']),
    ministry: z.string(),
    sector: z.string(),
    disease_or_theme: z.string(),
    status: z.enum(['preview', 'open', 'in-progress', 'output-available', 'concluded']),
    difficulty: z.enum(['bsc', 'msc', 'phd', 'mixed']),
    time_estimate_months: z.number(),
    methods: z.array(z.string()),
    budget_ask_usd: z.number().optional(),
    open_to_support: z.boolean().default(false),
    one_line: z.string(),
    why_it_matters: z.string(),
  }),
});

export const collections = { modules, countries, researchers, dossiers };
