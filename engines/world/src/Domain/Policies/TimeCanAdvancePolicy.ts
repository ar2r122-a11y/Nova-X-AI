import { WorldAggregate } from "../Aggregates/WorldAggregate";

export class TimeCanAdvancePolicy {
    static canAdvance(aggregate: WorldAggregate, requestedSeconds: number): boolean {
        if (aggregate.getWorldState().getValue() !== "simulation_running") {
            return false;
        }
        if (requestedSeconds <= 0) {
            return false;
        }
        return true;
    }
}
