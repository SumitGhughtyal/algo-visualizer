export const APP_NAME = "GridSentinel";
export const APP_NAME_PARTS = ["Grid", "Sentinel"]; // shown stacked in the big header, like "Glass / Morphism"
export const APP_TAGLINE = "Visualize · Analyze · Understand";
export const REPO_URL = "https://github.com/SumitGhughtyal/algo-visualizer";


export type SectionId =
  | "array"
  | "stack"
  | "queue"
  | "linked-list"
  | "hash-table"
  | "tree"
  | "graph"
  | "sorting"
  | "analyzer";

export interface NavItem {
  id: SectionId;
  label: string;
  ready: boolean; // false = shown as "Soon" and not clickable yet
}

export const NAV_ITEMS: NavItem[] = [
  { id: "array", label: "Array", ready: true },
  { id: "stack", label: "Stack", ready: false },
  { id: "queue", label: "Queue", ready: false },
  { id: "linked-list", label: "Linked List", ready: false },
  { id: "hash-table", label: "Hash Table", ready: false },
  { id: "tree", label: "Tree", ready: false },
  { id: "graph", label: "Graph", ready: false },
  { id: "sorting", label: "Sorting", ready: false },
  { id: "analyzer", label: "Analyzer", ready: false },
];