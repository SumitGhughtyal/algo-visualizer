import { Recorder } from "@/engine/recorder"
import type { Cell, OperationResult } from "@/engine/types";

// Used when the input is invalid: one frame explaining why
function rejected(name: string, data: number[], message:string): OperationResult{
    const rec = new Recorder(name, "O(1)");
    rec.snapshot(data, message);
    return rec.finish();
}
 
// ACCESS: read the value at an index. O(1)
export function accessAt(data: number[], index: number): OperationResult{
    const name = `Access index ${index}`;
    if(!Number.isInteger(index) || index < 0 || index >= data.length) {
        return rejected(name, data, `Index ${index} is out of range (valid: 0 to ${data.length-1})`);
    }
    const rec = new Recorder(name, "O(1)");
    rec.snapshot(data, "Start");
    rec.read();
    rec.snapshot(data, `Jump straight to index ${index}: value is ${data[index]}`, [
        {index, kind: "found"},
    ]);
    return rec.finish();
}

// UPDATE: overwrite the value at an index. O(1)
export function updateAt(data: number[], index:number, value:number): OperationResult{
    const name = `Update index ${index} to ${index}`;
    if(!Number.isInteger(index) || index < 0 || index >= data.length){
        return rejected(name, data, `Index ${index} is out of range (valid: 0 to ${data.length-1})`);
    }
    const rec = new Recorder(name, "O(1)");
    const arr: Cell[] = [...data];
    rec.snapshot(arr, "Start");
    rec.write();
    arr[index] = value;
    rec.snapshot(arr, `Overwrite index ${index} with ${value}`, [{ index, kind: "inserted"}]);
    return rec.finish();
} 

// INSERT: add a value at an index, shifting everything after it right. O(n)
export function insertAt(data: number[], index: number, value: number): OperationResult {
    const name = `Insert ${value} at index ${index}`;
    const n = data.length;
    if(!Number.isInteger(index) || index < 0 || index > n){
        return rejected(name, data, `Index ${index} is out of range (valid: 0 to ${n})`);
    }
    const rec = new Recorder(name, "O(n)");
    const arr: Cell[] = [...data];
    rec.snapshot(arr, "Start");

    arr.push(null);
    rec.snapshot(arr, "Make room: add an empty slot at the end", [{ index: n, kind: "active"}]);

    // Walk from the right end back to the insert position, moving each element one step right
    for(let i = n - 1; i >= index; i--){
        rec.read();
        rec.write();
        arr[i+1] = arr[i];
        arr[i] = null;
        rec.snapshot(arr, `Shift ${arr[i+1]} from index ${i} to index ${i+1}`, [
            {index:i+1, kind:"active"},
        ])
    }

    rec.write();
    arr[index] = value;
    rec.snapshot(arr, `Place ${value} at index ${index}`, [{ index, kind: "inserted"}]);
    return rec.finish();
}

// DELETE: remove the value at an index, shifting everything after it left. O(n)
export function deleteAt(data: number[], index: number): OperationResult {
    const name = `Delete index ${index}`;
    const n = data.length;
    if(!Number.isInteger(index) || index < 0 || index >=n) {
        return rejected(name, data, `Index ${index} is out of range (valid: 0 to ${n-1})`);
    }
    const rec = new Recorder(name, "O(n)");
    const arr: Cell[] = [...data];
    rec.snapshot(arr, "Start");
    rec.snapshot(arr, `Delete ${arr[index]} at index ${index}`, [{ index, kind: "removed"}]);

    rec.write();
    arr[index] = null;
    rec.snapshot(arr, `Clear index ${index}`, [{ index, kind: "removed"}]);

    // Move each later element one step left to close the gap
    for (let i = index + 1; i < n; i++) {
        rec.read();
        rec.write();
        arr[i - 1] = arr[i];
        arr[i] = null;
        rec.snapshot(arr, `Shift ${arr[i-1]} from index ${i} to index ${i-1}`, [
            {index: i - 1, kind: "active"},
        ])
    }

    arr.pop();
    rec.snapshot(arr, "Remove the empty slot at the end");
    return rec.finish();
}

// SEARCH: check each element from the left until the target is found. O(n)
export function linearSearch(data: number[], target: number): OperationResult {
    const name = `Search for ${target}`;
    const rec = new Recorder(name, "O(n)");
    rec.snapshot(data, "Start at index 0");

    for(let i = 0; i < data.length; i++){
        rec.read();
        rec.compare();
        if (data[i] == target){
            rec.snapshot(data, `Index ${i}: ${data[i]} equals ${target}. Found it!`, [{ index: i, kind: "found"},]);
            return rec.finish();
        }
        rec.snapshot(data, `Index ${i}: ${data[i]} is not ${target}, move on`, [{ index: i, kind: "compare"}]);
    }

    rec.snapshot(data, `Checked every element. ${target} is not in the array`);
    return rec.finish();

}