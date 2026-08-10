import { MemoryTypeRef } from "../ValueObjects/MemoryType";

export class MemoryImportancePolicy {
    static calculateBaseImportance(type: MemoryTypeRef, _accessCount: number, _ageMs: number): number {
        let base = 0.5;
        if (type.getValue() === "episodic") {
            base = 0.7;
        } else if (type.getValue() === "semantic") {
            base = 0.8;
        } else if (type.getValue() === "working") {
            base = 0.3;
        }
        return base;
    }

    static isValidSalience(salience: import("../ValueObjects/MemorySalience").MemorySalience): boolean {
        const value = salience.getValue();
        return value >= 0.0 && value <= 1.0;
    }
}
