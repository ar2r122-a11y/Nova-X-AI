import type { IVoiceEngine } from "../../Contracts/IVoiceEngine";
import type { ISchedulerWorker } from "../../Contracts/ISchedulerWorker";
import type { RuntimeConfiguration } from "../../Contracts/Runtime";
import { BaseVoiceWorker } from "./BaseVoiceWorker";

export class SchedulerWorker extends BaseVoiceWorker {
    constructor() {
        super(60000);
    }

    async schedule(task: import("../../Domain/Entities/ScheduledVoiceTaskEntity").ScheduledVoiceTaskEntity): Promise<void> {
        if (!this.engine) {
            throw new Error("SchedulerWorker not configured with engine.");
        }
        const { ScheduleVoiceTaskCommand } = await import("../../Application/Commands/ScheduleVoiceTaskCommand");
        const command = new ScheduleVoiceTaskCommand(
            task.getVoiceId(),
            task.getText(),
            task.getProfileId(),
            task.getScheduledAt(),
            task.getPriority(),
            task.getMaxRetries(),
            `scheduler-${Date.now()}`,
            "",
            { roles: ["system"], permissions: ["*"] }
        );
        await this.engine.scheduleVoiceTask(command);
    }

    async cancel(taskId: string): Promise<void> {
        if (!this.engine) {
            throw new Error("SchedulerWorker not configured with engine.");
        }
    }

    protected tickImpl(): Promise<void> {
        return Promise.resolve();
    }
}
