import { RecordMetricCommand } from "../Commands/RecordMetricCommand";

export class RecordMetricValidator {
    static validate(command: RecordMetricCommand): void {
        if (!command.name || command.name.trim().length === 0) {
            throw new Error("Metric name is required.");
        }
        if (typeof command.value !== "number" || !isFinite(command.value)) {
            throw new Error("Metric value must be a finite number.");
        }
        if (!command.unit || command.unit.trim().length === 0) {
            throw new Error("Metric unit is required.");
        }
        if (!Array.isArray(command.tags)) {
            throw new Error("Metric tags must be an array.");
        }
    }
}
