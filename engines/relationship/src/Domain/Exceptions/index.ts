export class RelationshipNotFoundException extends Error {
    constructor(relationshipId: string) {
        super(`Relationship "${relationshipId}" was not found.`);
        this.name = "RelationshipNotFoundException";
        Object.setPrototypeOf(this, RelationshipNotFoundException.prototype);
    }
}

export class InvalidMetricBoundsException extends Error {
    constructor(metricName: string, value: number, min: number, max: number) {
        super(`${metricName} value ${value} is out of bounds [${min}, ${max}].`);
        this.name = "InvalidMetricBoundsException";
        Object.setPrototypeOf(this, InvalidMetricBoundsException.prototype);
    }
}

export class MetricCalculationException extends Error {
    constructor(message: string, public readonly correlationId: string) {
        super(message);
        this.name = "MetricCalculationException";
        Object.setPrototypeOf(this, MetricCalculationException.prototype);
    }
}

export class RelationshipStateTransitionException extends Error {
    constructor(currentStatus: string, attemptedStatus: string) {
        super(`Invalid relationship state transition from "${currentStatus}" to "${attemptedStatus}".`);
        this.name = "RelationshipStateTransitionException";
        Object.setPrototypeOf(this, RelationshipStateTransitionException.prototype);
    }
}
