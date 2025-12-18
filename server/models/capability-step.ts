// server/models/capability-step.ts
// -----------------------------------------------------------------------------
//  Canonical data model for a *single* capability / milestone entry that lives
//  in data/capability-matrix.yml.  All loaders and services downstream rely on
//  this interface for full type‑safety.
// -----------------------------------------------------------------------------

/**
 * Localised text container.  Both keys *must* be present in the YAML even if the
 * value is the same – that guarantees predictable fall‑back behaviour.
 */
export interface LocalisedText {
  /** English */ en: string;
  /** Japanese */ ja: string;
}

/**
 * Question dependency for smart roadmap building.
 * If the specified question score meets the minimum value,
 * this capability is considered already implemented.
 */
export interface QuestionDependency {
  questionId: string;  // e.g. "sc_1", "cicd_3"  
  minValue: number;    // Minimum score (0-100) to consider capability satisfied
}

/**
 * Enum‑like unions keep the YAML clean (short strings) while preserving strong
 * typing in TS.  Extend with caution – downstream scoring logic may depend on
 * the exact literal union.
 */
export type CapabilityPhase = 'beginner' | 'intermediate' | 'advanced';
export type ImpactArea      = 'IC' | 'OE' | 'DP' | 'IM' | 'TM';

/**
 * A single row of the capability matrix.
 *
 * Rules & conventions (enforced by CI‑lint scripts):
 *  • `id` is globally unique and kebab‑cased.
 *  • `order` is 1‑based *within* a (category, phase) group and purely visual.
 *  • `effort_points` uses Fibonacci (1,2,3,5,8,13) for t‑shirt sizing.
 */
export interface CapabilityStep {
  id:            string;           // e.g. "cicd_basic-pipeline"
  category:      string;           // matches assessment categoryId
  phase:         CapabilityPhase;  // beginner | intermediate | advanced
  order:         number;           // rendering order within phase

  label:         LocalisedText;    // UI card title
  description:   LocalisedText;    // shorter than ~120 chars – paragraph text

  effort_points: number;           // 1‥13
  impact_area:   ImpactArea;       // maps to cost model IC/OE/…

  quick_win?:    boolean;          // surfaces in Quick‑Win UI if true
  dependencies:  string[];         // list of *id*s that must be completed first
  
  // NEW: Smart roadmap dependencies based on assessment question scores
  questionDependencies?: QuestionDependency[];  // If satisfied, skip this capability
}

/** Convenience helper so callers can discriminate without repeating unions */
export type CapabilityMatrix = CapabilityStep[]; 