import type { IRelationshipEngine } from "../../Contracts/IRelationshipEngine";
import type { IRelationshipWorker } from "../../Contracts/IRelationshipEngine";

export class DecayWorker implements IRelationshipWorker {
    private engine: IRelationshipEngine | null = null;
    private intervalId: ReturnType<typeof setInterval> | null = null;
    private running = false;

    setEngine(engine: IRelationshipEngine): void {
        this.engine = engine;
    }

    async start(): Promise<void> {
        if (this.running) {
            return;
        }
        this.running = true;
        this.intervalId = setInterval(() => {
            this.tick();
        }, 86400000);
    }

    async stop(): Promise<void> {
        this.running = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    isRunning(): boolean {
        return this.running;
    }

    getWorkerName(): string {
        return "RelationshipDecayWorker";
    }

    private async tick(): Promise<void> {
        if (!this.engine) {
            return;
        }

        try {
            const relationships = await this.engine.getRepository().getAll();
            for (const relationship of relationships) {
                await this.engine.executeRelationshipDecay(
                    relationship.getRelationshipId(),
                    86400000
                );
            }
        } catch (error) {
            console.error("Relationship decay tick failed:", error);
        }
    }
}
