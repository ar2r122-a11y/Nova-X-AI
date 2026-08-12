export interface ISchedulerWorker {
    scheduleDelayedMessage(
        conversationId: string,
        sessionId: string,
        prompt: string,
        scheduledAt: number
    ): Promise<void>;
    scheduleReminder(
        conversationId: string,
        sessionId: string,
        reminderAt: number,
        message: string
    ): Promise<void>;
    cancelScheduledTask(taskId: string): Promise<void>;
    getWorkerName(): string;
    start(): Promise<void>;
    stop(): Promise<void>;
}
