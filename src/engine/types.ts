// A slot in the array: a number, or null when the slot is empty
export type Cell = number | null;

export type HighLightKind = 
  | "active"   // element being looked at
  | "compare"  // element being compared 
  | "found"    // search success
  | "inserted" // newly addded element
  | "removed"; // element about to be deleted

export interface HighLight {
    index: number;
    kind: HighLightKind;
}

export interface Stats {
    comparsions: number;
    reads: number;
    writes: number;
}

// One "picture" of the data structure at one moment
export interface Frame {
    data : Cell[];
    highlights : HighLight[];
    message: string;   // plain-English explanation shown
    stats: Stats;      // running totals up to this frame
}

// What every operation (insert, delete, search, ...) returns
export interface OperationResult {
    name : string;
    complexity : string;
    frames : Frame[];
}