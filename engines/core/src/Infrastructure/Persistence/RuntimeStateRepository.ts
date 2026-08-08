import { IRuntimeStateRepository } from "../../Contracts/IRuntimeStateRepository";
import { RuntimeState } from "../../runtime/RuntimeState";

/**
 * Nova X AI
 * Nova Core
 * RuntimeStateRepository — in-memory implementation
 *
 * Implements IRuntimeStateRepository (Contracts/IRuntimeStateRepository.ts).
 * Stores the current RuntimeState in memory.
 * A persistent implementation (IndexedDB / Storage Engine) will replace
 * this once the Storage Engine is available.
 *
 * SDS §1: Nova Core must persist and restore runtime state.
 */
export class RuntimeStateRepository implements IRuntimeStateRepository {

    private currentState: RuntimeState | null = null;

    public async save(
        state: RuntimeState
    ): Promise<void> {

        this.currentState = state;

    }

    public async load(): Promise<RuntimeState | null> {

        return this.currentState;

    }

    public async clear(): Promise<void> {

        this.currentState = null;

    }

}
