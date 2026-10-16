import type { Cell, Frame, HighLight, OperationResult, Stats } from "./types";

export class Recorder {
    private frames: Frame[] = [];
    private stats: Stats = { comparisons: 0, reads: 0, writes: 0};
    private name: string;
    private complexity: string;

    constructor(name: string, complexity: string){
        this.name = name;
        this.complexity = complexity;
    }

    // Call these whenever the operation does the matching work
    read(): void{
        this.stats.reads++;
    }

    write(): void{
        this.stats.writes++;
    }
    compare(): void{
        this.stats.comparisons++;
    }

    // Save a picture of the structure right now
    snapshot(data: Cell[], message: string, highlights: HighLight[] = []): void {
        this.frames.push({
            data: [...data],  // copy, so later changes don't alter old frames
            highlights,
            message,
            stats: {...this.stats}, // copy the running tables too
        });
    }

    finish(): OperationResult{
        return {name: this.name, complexity: this.complexity, frames: this.frames };
    }
}

// The data as it looks after the operation finishes
export function finalData(result: OperationResult): number[]{
    const last = result.frames[result.frames.length-1];
    return last.data.filter((c): c is number => c !== null);
}