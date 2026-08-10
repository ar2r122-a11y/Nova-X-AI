import { WorldAggregate } from "../Aggregates/WorldAggregate";

export class IsWorldActiveSpecification {
    static isSatisfiedBy(aggregate: WorldAggregate): boolean {
        const state = aggregate.getWorldState().getValue();
        return state === "active" || state === "simulation_running" || state === "time_paused" || state === "environmental_shift";
    }
}
