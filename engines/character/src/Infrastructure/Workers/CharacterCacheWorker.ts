import type { ICharacterEngine } from "../../Contracts/ICharacterEngine";
import type { ICharacterWorker } from "../../Contracts/ICharacterWorker";

export class CharacterCacheWorker implements ICharacterWorker {
    private characterEngine: ICharacterEngine | null = null;
    private intervalId: ReturnType<typeof setInterval> | null = null;
    private running = false;
    private readonly cache = new Map<string, { aggregate: unknown; timestamp: number }>();
    private readonly maxSize = 100;
    private readonly ttlMs = 300000;

    setCharacterEngine(engine: ICharacterEngine): void {
        this.characterEngine = engine;
    }

    async start(): Promise<void> {
        if (this.running) {
            return;
        }
        this.running = true;
        this.intervalId = setInterval(() => {
            this.maintainCache();
        }, 60000);
    }

    async stop(): Promise<void> {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.cache.clear();
        this.running = false;
    }

    isRunning(): boolean {
        return this.running;
    }

    getWorkerName(): string {
        return "CharacterCacheWorker";
    }

    getCached(characterId: string): unknown | null {
        const entry = this.cache.get(characterId);
        if (!entry) {
            return null;
        }
        if (Date.now() - entry.timestamp > this.ttlMs) {
            this.cache.delete(characterId);
            return null;
        }
        return entry.aggregate;
    }

    setCached(characterId: string, aggregate: unknown): void {
        if (this.cache.size >= this.maxSize) {
            const firstKey = this.cache.keys().next().value;
            if (firstKey) {
                this.cache.delete(firstKey);
            }
        }
        this.cache.set(characterId, { aggregate, timestamp: Date.now() });
    }

    clearCache(): void {
        this.cache.clear();
    }

    private async maintainCache(): Promise<void> {
        if (!this.characterEngine) {
            return;
        }

        const activeCharacters = await this.characterEngine.getActiveCharacters();
        const activeIds = new Set(activeCharacters.map((c) => c.getId().getValue()));

        for (const [id] of this.cache) {
            if (!activeIds.has(id)) {
                this.cache.delete(id);
            }
        }

        for (const character of activeCharacters) {
            this.setCached(character.getId().getValue(), character);
        }
    }
}
