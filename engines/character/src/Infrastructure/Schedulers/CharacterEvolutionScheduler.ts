export class CharacterEvolutionScheduler {
    private readonly checks = new Map<string, ReturnType<typeof setTimeout>>();

    scheduleEvolutionCheck(characterId: string, intervalMs: number): void {
        this.cancelEvolutionCheck(characterId);
        const timeout = setTimeout(() => {
            this.checks.delete(characterId);
        }, intervalMs);
        this.checks.set(characterId, timeout);
    }

    cancelEvolutionCheck(characterId: string): void {
        const timeout = this.checks.get(characterId);
        if (timeout) {
            clearTimeout(timeout);
            this.checks.delete(characterId);
        }
    }
}
