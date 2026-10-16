import { describe, it, expect } from "vitest";
import {
  accessAt,
  updateAt,
  insertAt,
  deleteAt,
  linearSearch,
} from "./array";
import { finalData } from "@/engine/recorder";
import type { OperationResult } from "@/engine/types";

// The last frame holds the final state and the total operation counts
function lastFrame(result: OperationResult) {
  return result.frames[result.frames.length - 1];
}

describe("insertAt", () => {
  it("inserts in the middle and shifts later elements right", () => {
    const result = insertAt([1, 2, 3], 1, 9);
    expect(finalData(result)).toEqual([1, 9, 2, 3]);
  });

  it("inserting at the end shifts nothing", () => {
    const result = insertAt([1, 2, 3], 3, 9);
    expect(finalData(result)).toEqual([1, 2, 3, 9]);
    expect(lastFrame(result).stats.reads).toBe(0);
    expect(lastFrame(result).stats.writes).toBe(1);
  });

  it("inserting at the start shifts every element", () => {
    const result = insertAt([1, 2, 3, 4], 0, 9);
    expect(finalData(result)).toEqual([9, 1, 2, 3, 4]);
    expect(lastFrame(result).stats.reads).toBe(4);   // n shifts
    expect(lastFrame(result).stats.writes).toBe(5);  // n shifts + 1 placement
  });

  it("cost grows with array size (O(n))", () => {
    const small = insertAt(Array.from({ length: 10 }, (_, i) => i), 0, 99);
    const large = insertAt(Array.from({ length: 100 }, (_, i) => i), 0, 99);
    expect(lastFrame(small).stats.reads).toBe(10);
    expect(lastFrame(large).stats.reads).toBe(100);
  });

  it("rejects an out-of-range index and leaves data unchanged", () => {
    const result = insertAt([1, 2, 3], 7, 9);
    expect(result.frames).toHaveLength(1);
    expect(finalData(result)).toEqual([1, 2, 3]);
    expect(lastFrame(result).message).toContain("out of range");
  });

  it("does not change the input array or earlier frames", () => {
    const input = [1, 2, 3];
    const result = insertAt(input, 1, 9);
    expect(input).toEqual([1, 2, 3]);
    expect(result.frames[0].data).toEqual([1, 2, 3]);
  });
});

describe("deleteAt", () => {
  it("deletes in the middle and shifts later elements left", () => {
    const result = deleteAt([1, 2, 3, 4], 1);
    expect(finalData(result)).toEqual([1, 3, 4]);
    expect(lastFrame(result).stats.reads).toBe(2);
    expect(lastFrame(result).stats.writes).toBe(3);
  });

  it("deleting the last element shifts nothing", () => {
    const result = deleteAt([1, 2, 3], 2);
    expect(finalData(result)).toEqual([1, 2]);
    expect(lastFrame(result).stats.reads).toBe(0);
    expect(lastFrame(result).stats.writes).toBe(1);
  });

  it("rejects an out-of-range index", () => {
    const result = deleteAt([1, 2, 3], 3);
    expect(result.frames).toHaveLength(1);
    expect(finalData(result)).toEqual([1, 2, 3]);
  });
});

describe("linearSearch", () => {
  it("finds a value and stops early", () => {
    const result = linearSearch([5, 7, 9], 7);
    expect(lastFrame(result).stats.comparisons).toBe(2);
    expect(lastFrame(result).highlights).toContainEqual({ index: 1, kind: "found" });
  });

  it("checks every element when the value is missing", () => {
    const result = linearSearch([5, 7, 9], 4);
    expect(lastFrame(result).stats.comparisons).toBe(3);
    expect(lastFrame(result).message).toContain("not in the array");
  });
});

describe("accessAt and updateAt", () => {
  it("access costs one read and no writes (O(1))", () => {
    const result = accessAt([4, 5, 6], 2);
    expect(lastFrame(result).stats.reads).toBe(1);
    expect(lastFrame(result).stats.writes).toBe(0);
  });

  it("update overwrites one value with one write", () => {
    const result = updateAt([4, 5, 6], 1, 50);
    expect(finalData(result)).toEqual([4, 50, 6]);
    expect(lastFrame(result).stats.writes).toBe(1);
  });
});