import type { ISchedulerWorker } from "../../Contracts/ISchedulerWorker";

export class ConversationRoutineScheduler implements ISchedulerWorker {
    private readonly tasks = new Map<string, number>();

    public getWorkerName(): string {
        return "ConversationRoutineScheduler";
    }

    public async start(): Promise<void> {}

    public async stop(): Promise<void> {
        this.tasks.clear();
    }

    public async scheduleDelayedMessage(
        _conversationId: string,
        _sessionId: string,
        _prompt: string,
        scheduledAt: number
    ): Promise<void> {
        const taskId = `routine-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
        this.tasks.set(taskId, scheduledAt);
    }

    public async scheduleReminder(
        _conversationId: string,
        _sessionId: string,
        reminderAt: number,
        _message: string
    ): Promise<void> {
        const taskId = `reminder-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
        this.tasks.set(taskId, reminderAt);
    }

    public async cancelScheduledTask(taskId: string): Promise<void> {
        this.tasks.delete(taskId);
    }
}
