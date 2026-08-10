export type WorldRuntimeState = "initialized" | "active" | "simulation_running" | "time_paused" | "environmental_shift" | "archived" | "failed" | "recovering";

export const WorldRuntimeStateTransitions: Record<WorldRuntimeState, WorldRuntimeState[]> = {
    initialized: ["active", "failed"],
    active: ["simulation_running", "time_paused", "archived", "failed"],
    simulation_running: ["time_paused", "environmental_shift", "archived", "failed"],
    time_paused: ["simulation_running", "archived", "failed"],
    environmental_shift: ["simulation_running", "archived", "failed"],
    archived: [],
    failed: ["recovering", "archived"],
    recovering: ["active", "failed"]
};

export function isValidRuntimeTransition(from: WorldRuntimeState, to: WorldRuntimeState): boolean {
    return WorldRuntimeStateTransitions[from]?.includes(to) ?? false;
}

export function getWorldRuntimeStateDisplayName(state: WorldRuntimeState): string {
    return state.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}
