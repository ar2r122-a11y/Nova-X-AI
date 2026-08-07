import { RuntimeState } from "./RuntimeState";

export class RuntimeManager {

    private currentState: RuntimeState =
        RuntimeState.Uninitialized;

    public getState(): RuntimeState {
        return this.currentState;
    }

    public setState(state: RuntimeState): void {
        this.currentState = state;
    }

    public isRunning(): boolean {
        return this.currentState === RuntimeState.Running;
    }

}