import type { ISchedulerWorker } from "../../Contracts/ISchedulerWorker";

export class SchedulerWorker implements ISchedulerWorker {
    private readonly scheduledTasks = new Map<string, {
        conversationId: string;
        sessionId: string;
        scheduledAt: number;
        prompt: string;
        reminderAt?: number;
        message?: string;
    }>();

    public getWorkerName(): string {
        return "ConversationSchedulerWorker";
    }

    public async start(): Promise<void> {}

    public async stop(): Promise<void> {
        this.scheduledTasks.clear();
    }

    public async scheduleDelayedMessage(
        conversationId: string,
        sessionId: string,
        prompt: string,
        scheduledAt: number
    ): Promise<void> {
        const taskId = `delayed-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
        this.scheduledTasks.set(taskId, {
            conversationId,
            sessionId,
            scheduledAt,
            prompt
        });
    }

    public async scheduleReminder(
        conversationId: string,
        sessionId: string,
        reminderAt: number,
        message: string
    ): Promise<void> {
        const taskId = `reminder-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
        this.scheduledTasks.set(taskId, {
            conversationId,
            sessionId,
            scheduledAt: reminderAt,
            prompt: message,
            reminderAt
        });
    }

    public async cancelScheduledTask(taskId: string): Promise<void> {
        this.scheduledTasks.delete(taskId);
    }
}
