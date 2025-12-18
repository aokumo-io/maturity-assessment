/**********************************************************************
 * Road-map data structures
 * --------------------------------------------------------------------
 * These types are consumed by:
 *   • roadmap-builder.ts  – builds a phased plan
 *   • routes/implementation.ts – delivers the JSON to the front-end
 *   • front-end UI (Implementation Plan) – strict typing via OpenAPI
 *********************************************************************/

import type { ImpactArea, LocalisedText, CapabilityStep, CapabilityPhase } from './capability-step';
import type { CategoryId } from '../rules/issue-rule-model';

/* ------------------------------------------------------------------ */
/* 1.  Timeline helpers                                               */
/* ------------------------------------------------------------------ */

export type TimeUnit = 'weeks' | 'months';

/** Generic "1-2 months", "3-5 weeks", etc. */
export interface DurationRange {
  min: number;            // inclusive
  max: number;            // inclusive
  unit: TimeUnit;
}

/** Simple enum to group phases in the UI */
export type PhaseBand = 'short' | 'medium' | 'long';

/* ------------------------------------------------------------------ */
/* RoadmapItem - Extended CapabilityStep as used in roadmap-builder   */
/* ------------------------------------------------------------------ */

export interface RoadmapItem extends CapabilityStep {
  priority: number;
  duration_weeks: number;
  // Flag to indicate this is a considerations-only item for high-maturity categories
  considerations_only?: boolean;
}

/* ------------------------------------------------------------------ */
/* 2.  Recommendation object (leaf of the plan)                       */
/* ------------------------------------------------------------------ */

export interface Recommendation {
  /** Unique, stable ID (e.g. "sec-image-scan-pipeline") */
  id: string;

  /** Display label / description (localised) pulled from matrix */
  stepRef: CapabilityStep['id'];

  /** Derived meta-data */
  category: CategoryId;
  impactArea: ImpactArea;

  /* ---- scoring engine outputs ---- */
  priorityRank: number;        // 1 = highest priority
  impactLevel: 'Low' | 'Medium' | 'High';      // qualitative
  effortLevel: 'Low' | 'Medium' | 'High';      // qualitative
  roiScore: number;            // raw ROI for sorting

  /** Target timeline suggested by the engine */
  timeline: DurationRange;

  /** Quick win flag propagated from matrix */
  quickWin?: boolean;
  
  /** Localized display labels */
  label: LocalisedText;
  
  /** Localized descriptions */
  description: LocalisedText;
  
  /** Original phase from capability matrix (beginner, intermediate, advanced) */
  phase?: CapabilityPhase;
  
  /** Stretch goal considerations for high-maturity categories */
  considerations?: string[];
}

/* ------------------------------------------------------------------ */
/* 3.  Phase container                                                */
/* ------------------------------------------------------------------ */

export interface RoadmapPhase {
  /** 0-based index (0 = Phase 1 / short term) */
  index: number;

  /** UX label translated at runtime ("Phase 1: Short-term") */
  band: PhaseBand;

  /** Absolute calendar window – only if user provides a start date */
  timespan?: {
    startDateISO: string;      // YYYY-MM-DD
    endDateISO: string;
  };

  /** Sorted list of actions for this phase */
  recommendations: Recommendation[];
}

/* ------------------------------------------------------------------ */
/* 4.  The full plan returned by the API                              */
/* ------------------------------------------------------------------ */

export interface ImplementationRoadmap {
  /** ID of the assessment snapshot the roadmap is based on */
  assessmentId: number;

  /** Shallow lookup table for details view */
  recommendationsById: Record<string, Recommendation>;

  /** Ordered buckets for the phase cards */
  phases: RoadmapPhase[];
}
