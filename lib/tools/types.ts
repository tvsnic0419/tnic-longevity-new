/**
 * TNiC Advanced Tools — canonical data structures.
 * Rule-based engines consume these shapes; Zustand store mirrors UI state.
 */

import type { EvidenceTier } from '../types';
import type { LabEntry } from '../labs';
import type { ProtocolGoal } from './protocol-customizer';

// ── Protocol Recommendation Engine ──────────────────────────────────────────

export type PathwayId = 'nrf2' | 'mito' | 'epigenetic' | 'inflammation' | 'proteostasis' | 'nutrient';

export type ProtocolPhaseId = 'foundation' | 'optimization' | 'maintenance';

export interface ReasoningStep {
  id: string;
  rule: string;
  input: string;
  conclusion: string;
  weight: number;
  confidence: number;
}

export interface PathwayCompound {
  compoundId: string;
  name: string;
  dose: string;
  timing: 'AM' | 'PM' | 'AM/PM';
  evidence: EvidenceTier;
  rationale: string;
}

export interface PathwayPlan {
  id: PathwayId;
  name: string;
  description: string;
  hallmarkIds: string[];
  compounds: PathwayCompound[];
  lifestyleActions: string[];
  confidence: number;
  priority: number;
  reasoning: ReasoningStep[];
}

export interface ProtocolPhase {
  id: ProtocolPhaseId;
  label: string;
  weeks: string;
  objectives: string[];
  pathways: PathwayPlan[];
  checkpoints: string[];
}

export interface ProtocolEngineInput {
  age: number;
  goals: ProtocolGoal[];
  stress: number;
  sleep: number;
  exercise: number;
  budget: 'budget' | 'moderate' | 'premium';
  complexity: 'minimal' | 'standard' | 'advanced';
  labEntries?: LabEntry[];
  existingStack?: string[];
}

export interface ProtocolEngineOutput {
  generatedAt: string;
  confidence: number;
  summary: string;
  phases: ProtocolPhase[];
  hallmarkPriorities: { id: string; title: string; score: number; number: number }[];
  amMasterSchedule: string[];
  pmMasterSchedule: string[];
  monitoringPanel: string[];
  retestCadence: string;
  evidenceTier: EvidenceTier;
  reasoningChain: ReasoningStep[];
  disclaimer: string;
}

// ── Stack Network Analyzer ────────────────────────────────────────────────

export type NetworkEdgeType = 'synergy' | 'caution' | 'contraindication' | 'potential';

export interface NetworkNode {
  id: string;
  label: string;
  shortLabel: string;
  pathway: string;
  evidence: EvidenceTier;
  x: number;
  y: number;
  selected: boolean;
  bioavailability: number;
}

export interface NetworkEdge {
  id: string;
  source: string;
  target: string;
  type: NetworkEdgeType;
  label: string;
  detail: string;
  severity: 'low' | 'medium' | 'high';
  active: boolean;
}

export interface StackNetworkGraph {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  stats: {
    synergyCount: number;
    cautionCount: number;
    contraindicationCount: number;
    activeSynergyCount: number;
    activeConflictCount: number;
    networkDensity: number;
  };
}

// ── Biomarker Dashboard ───────────────────────────────────────────────────

export interface TrendPoint {
  date: string;
  value: number;
  status: 'optimal' | 'watch' | 'critical';
}

export interface MarkerTrendSeries {
  markerId: string;
  markerName: string;
  unit: string;
  optimal: string;
  points: TrendPoint[];
  trend: 'improving' | 'declining' | 'stable' | 'unknown';
  slopePerMonth: number;
  latestValue: number | null;
  latestStatus: 'optimal' | 'watch' | 'critical' | 'none';
}

export interface ForecastPoint {
  week: number;
  value: number;
  bandLow: number;
  bandHigh: number;
}

export interface InterventionForecast {
  id: string;
  markerId: string;
  interventionName: string;
  category: 'compound' | 'lifestyle' | 'baseline';
  impactScore: number;
  baseline: ForecastPoint[];
  projected: ForecastPoint[];
  expectedDelta: number;
  timeframeWeeks: number;
  disclaimer: string;
}

export interface BiomarkerDashboardResult {
  generatedAt: string;
  healthspanScore: number;
  dataCompleteness: number;
  series: MarkerTrendSeries[];
  forecasts: InterventionForecast[];
  selectedMarkerId: string;
  topConcern: string | null;
  topWin: string | null;
  globalDisclaimer: string;
}

// ── Zustand store shape (mirrored in stores/toolsStore.ts) ───────────────

export interface ToolsStoreState {
  protocolGoals: ProtocolGoal[];
  protocolBudget: ProtocolEngineInput['budget'];
  protocolComplexity: ProtocolEngineInput['complexity'];
  networkHighlightNode: string | null;
  networkFilter: 'all' | 'active' | 'conflicts';
  dashboardMarkerId: string;
  forecastHorizonWeeks: 12 | 24 | 36;
  showForecastBands: boolean;
}