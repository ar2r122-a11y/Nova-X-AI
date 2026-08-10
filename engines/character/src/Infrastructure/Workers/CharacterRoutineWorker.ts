import type { ICharacterEngine } from "../../Contracts/ICharacterEngine";
import type { ICharacterWorker } from "../../Contracts/ICharacterWorker";
import { CharacterDomainServiceImpl } from "../../Domain/Services/CharacterDomainServiceImpl";
import { CharacterRoutineScheduler } from "../Schedulers/CharacterRoutineScheduler";

export class CharacterRoutineWorker implements ICharacterWorker {
    private characterEngine: ICharacterEngine | null = null;
    private intervalId: ReturnType<typeof setInterval> | null = null;
    private running = false;
    private readonly domainService = new CharacterDomainServiceImpl();
    private readonly scheduler = new CharacterRoutineScheduler();

    setCharacterEngine(engine: ICharacterEngine): void {
        this.characterEngine = engine;
    }

    async start(): Promise<void> {
        if (this.running) {
            return;
        }
        this.running = true;
        this.intervalId = setInterval(() => {
            this.evaluateRoutines();
        }, 30000);
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
        return "CharacterRoutineWorker";
    }

    private async evaluateRoutines(): Promise<void> {
        if (!this.characterEngine) {
            return;
        }

        const activeCharacters = await this.characterEngine.getActiveCharacters();
        const worldTime = new Date().toISOString().slice(0, 5);

        for (const character of activeCharacters) {
            const routine = character.getRoutine();
            const activity = this.domainService.evaluateRoutine(routine, worldTime);
            if (activity && activity !== routine.fallbackBehavior) {
                character.completeRoutineActivity(activity);
                this.scheduler.scheduleRoutine(character.getId().getValue(), 30000);
            }
        }
    }
}
