import type { ISchedulerService } from "../../Domain/Services";
import { ScheduledVoiceTaskEntity } from "../../Domain/Entities/ScheduledVoiceTaskEntity";

export class ScheduledTaskStore {
    private readonly tasks: Map<string, ScheduledVoiceTaskEntity> = new Map();

    add(task: ScheduledVoiceTaskEntity): void {
        this.tasks.set(task.getTaskId(), task);
    }

    get(taskId: string): ScheduledVoiceTaskEntity | undefined {
        return this.tasks.get(taskId);
    }

    remove(taskId: string): void {
        this.tasks.delete(taskId);
    }

    getAll(): ScheduledVoiceTaskEntity[] {
        return Array.from(this.tasks.values());
    }

    getDue(now: number): ScheduledVoiceTaskEntity[] {
        return this.getAll().filter(task => task.getScheduledAt() <= now && task.getStatus() === "pending");
    }

    clear(): void {
        this.tasks.clear();
    }
}

export class TaskPriorityQueue {
    private readonly queue: ScheduledVoiceTaskEntity[] = [];

    enqueue(task: ScheduledVoiceTaskEntity): void {
        this.queue.push(task);
        this.queue.sort((a, b) => b.getPriority() - a.getPriority());
    }

    dequeue(): ScheduledVoiceTaskEntity | undefined {
        return this.queue.shift();
    }

    size(): number {
        return this.queue.length;
    }

    clear(): void {
        this.queue.length = 0;
    }
}
