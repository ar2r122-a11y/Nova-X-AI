import { RuntimeState } from "../runtime/RuntimeState";

export interface IRuntimeStateRepository {

    save(state: RuntimeState): Promise<void>;

    load(): Promise<RuntimeState | null>;

    clear(): Promise<void>;

}