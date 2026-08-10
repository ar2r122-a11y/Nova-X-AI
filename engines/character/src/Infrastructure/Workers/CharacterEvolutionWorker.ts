import type { ICharacterEngine } from "../../Contracts/ICharacterEngine";
import type { ICharacterWorker } from "../../Contracts/ICharacterWorker";

export class CharacterEvolutionWorker implements ICharacterWorker {
    private characterEngine: ICharacterEngine | null = null;
    private intervalId: ReturnType<typeof setInterval> | null = null;
    private running = false;

    setCharacterEngine(engine: ICharacterEngine): void {
        this.characterEngine = engine;
    }

    async start(): Promise<void> {
        if (this.running) {
            return;
        }
        this.running = true;
        this.intervalId = setInterval(() => {
            this.evaluateEvolution();
        }, 300000);
    }

    async stop(): Promise<void> {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.running = false;
    }

    isRunning(): boolean {
        return this.running;
    }

    getWorkerName(): string {
        return "CharacterEvolutionWorker";
    }

    private async evaluateEvolution(): Promise<void> {
        if (!this.characterEngine) {
            return;
        }

        const activeCharacters = await this.characterEngine.getActiveCharacters();

        for (const character of activeCharacters) {
            const statistics = character.getStatistics();
            const currentStage = statistics.evolutionStage.getValue();
            const interactionCount = statistics.interactionCount;

            if (this.shouldEvolve(currentStage, interactionCount)) {
                try {
                    character.evolve();
                } catch {
                    continue;
                }
            }
        }
    }

    private shouldEvolve(currentStage: string, interactionCount: number): boolean {
        const stages = ["initial", "developing", "mature", "evolved"];
        const currentIndex = stages.indexOf(currentStage);

        if (currentIndex < 0 || currentIndex >= stages.length - 1) {
            return false;
        }

        const thresholds: Record<string, number> = {
            initial: 50,
            developing: 150,
            mature: 400
        };

        return interactionCount >= (thresholds[currentStage] ?? Infinity);
    }
}
