export type WorldState = "initialized" | "active" | "simulation_running" | "time_paused" | "environmental_shift" | "archived";

export class WorldStateRef {
    private readonly value: WorldState;

    private constructor(value: WorldState) {
        this.value = value;
    }

    static create(value: WorldState): WorldStateRef {
        const validStates: WorldState[] = ["initialized", "active", "simulation_running", "time_paused", "environmental_shift", "archived"];
        if (!validStates.includes(value)) {
            throw new Error(`Invalid WorldState: ${value}`);
        }
        return new WorldStateRef(value);
    }

    static initialized(): WorldStateRef {
        return WorldStateRef.create("initialized");
    }

    static active(): WorldStateRef {
        return WorldStateRef.create("active");
    }

    static simulationRunning(): WorldStateRef {
        return WorldStateRef.create("simulation_running");
    }

    static timePaused(): WorldStateRef {
        return WorldStateRef.create("time_paused");
    }

    static environmentalShift(): WorldStateRef {
        return WorldStateRef.create("environmental_shift");
    }

    static archived(): WorldStateRef {
        return WorldStateRef.create("archived");
    }

    getValue(): WorldState {
        return this.value;
    }

    equals(other: WorldStateRef): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }
}
