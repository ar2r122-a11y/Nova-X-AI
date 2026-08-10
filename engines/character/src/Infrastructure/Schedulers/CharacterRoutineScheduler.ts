export class CharacterRoutineScheduler {
    private readonly routines = new Map<string, ReturnType<typeof setTimeout>>();

    scheduleRoutine(characterId: string, intervalMs: number): void {
        this.cancelRoutine(characterId);
        const timeout = setTimeout(() => {
            this.routines.delete(characterId);
        }, intervalMs);
        this.routines.set(characterId, timeout);
    }

    cancelRoutine(characterId: string): void {
        const timeout = this.routines.get(characterId);
        if (timeout) {
            clearTimeout(timeout);
            this.routines.delete(characterId);
        }
    }
}
