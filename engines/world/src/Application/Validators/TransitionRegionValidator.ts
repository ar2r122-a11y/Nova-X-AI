import { TransitionRegionCommand } from "../Commands/TransitionRegionCommand";
import { WorldStateRef } from "../../Domain/ValueObjects/WorldState";

export class TransitionRegionValidator {
    validate(command: TransitionRegionCommand): void {
        if (!command.worldId || command.worldId.trim().length === 0) {
            throw new Error("WorldId is required.");
        }
        if (!command.regionId || command.regionId.trim().length === 0) {
            throw new Error("RegionId is required.");
        }
        if (!command.targetState || command.targetState.trim().length === 0) {
            throw new Error("TargetState is required.");
        }
        const validStates = ["initialized", "active", "simulation_running", "time_paused", "environmental_shift", "archived"];
        if (!validStates.includes(command.targetState)) {
            throw new Error(`Invalid target state: ${command.targetState}`);
        }
    }
}
