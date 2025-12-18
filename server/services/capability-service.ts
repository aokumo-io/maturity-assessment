import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

import { CapabilityStep, ImpactArea } from "../models/capability-step";

// Get equivalent of __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface VelocityTable {
  pointsPerIdealDay: number;
  idealDaysPerSprint: number;
  parallelStreams: Record<"xs" | "sm" | "md" | "lg", number>;
}

class CapabilityService {
  private static _instance: CapabilityService;
  private matrix: CapabilityStep[];
  private velocity: VelocityTable;

  private constructor() {
    const mPath = path.resolve(__dirname, "../data/capability-matrix.json");
    const vPath = path.resolve(__dirname, "../data/velocity-table.json");
    this.matrix   = JSON.parse(fs.readFileSync(mPath, "utf8"));
    this.velocity = JSON.parse(fs.readFileSync(vPath, "utf8"));
  }

  static get instance() {
    if (!this._instance) this._instance = new CapabilityService();
    return this._instance;
  }

  listAll()                     { return this.matrix; }
  listByCategory(cat: string)   { return this.matrix.filter(i => i.category === cat); }
  getById(id: string)           { return this.matrix.find(i => i.id === id); }

  /** Return immediate prerequisites (no transitive expansion) */
  depsOf(id: string) {
    const item = this.getById(id);
    return item?.dependencies ?? [];
  }

  /** crude impact weight (0–1) for a given item */
  impactWeight(item: CapabilityStep): number {
    const WEIGHTS: Record<ImpactArea, number> = { IC:0.2, OE:0.2, DP:0.25, IM:0.2, TM:0.15 };
    return WEIGHTS[item.impact_area];
  }

  velocityTable() {
    return this.velocity;
  }
}

export const capabilityService = CapabilityService.instance;
