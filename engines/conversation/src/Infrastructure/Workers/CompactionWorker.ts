import type { IConversationWorker } from "../../Contracts/IConversationWorker";

export class CompactionWorker implements IConversationWorker {
    private stopped = false;

    public getWorkerName(): string {
        return "ConversationCompactionWorker";
    }

    public async start(): Promise<void> {
        this.stopped = false;
    }

    public async stop(): Promise<void> {
        this.stopped = true;
    }

    public isRunning(): boolean {
        return !this.stopped;
    }
}
