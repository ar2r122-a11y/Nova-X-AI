import { describe, it, expect, vi, beforeEach } from "vitest";

interface MockTask {
    taskId: string;
    status: string;
    scheduledAt: number;
}

interface MockTaskStore {
    getDueTasks(): Promise<MockTask[]>;
    getAll(): Promise<MockTask[]>;
}

interface MockEventBus {
    publish(event: { type: string; payload: any }): Promise<void>;
}

class OfflineReconciliation {
    constructor(
        private readonly taskStore: MockTaskStore,
        private readonly eventBus: MockEventBus
    ) {}

    async reconcile(): Promise<{ reconciled: number; failed: number }> {
        const dueTasks = await this.taskStore.getDueTasks();
        const allTasks = await this.taskStore.getAll();

        let reconciled = 0;
        let failed = 0;

        for (const task of dueTasks) {
            if (task.status === "pending") {
                await this.eventBus.publish({
                    type: "TASK_DUE",
                    payload: { taskId: task.taskId, scheduledAt: task.scheduledAt }
                });
                reconciled++;
            }
        }

        for (const task of allTasks) {
            if (task.status === "failed") {
                await this.eventBus.publish({
                    type: "TASK_FAILED",
                    payload: { taskId: task.taskId }
                });
                failed++;
            }
        }

        return { reconciled, failed };
    }

    async hasMissedEvents(): Promise<boolean> {
        const dueTasks = await this.taskStore.getDueTasks();
        return dueTasks.some(task => task.status === "pending");
    }
}

describe("OfflineReconciliation", () => {
    let offlineReconciliation: OfflineReconciliation;
    let mockTaskStore: any;
    let mockEventBus: any;

    beforeEach(() => {
        mockTaskStore = {
            getDueTasks: vi.fn().mockResolvedValue([]),
            getAll: vi.fn().mockResolvedValue([])
        };
        mockEventBus = {
            publish: vi.fn().mockResolvedValue(undefined)
        };
        offlineReconciliation = new OfflineReconciliation(mockTaskStore, mockEventBus);
    });

    describe("reconcile", () => {

        it("returns zero counts when there are no tasks", async () => {
            const result = await offlineReconciliation.reconcile();
            expect(result.reconciled).toBe(0);
            expect(result.failed).toBe(0);
        });

        it("reconciles pending due tasks", async () => {
            mockTaskStore.getDueTasks.mockResolvedValue([
                { taskId: "task-1", status: "pending", scheduledAt: Date.now() - 1000 }
            ]);
            mockTaskStore.getAll.mockResolvedValue([
                { taskId: "task-1", status: "pending", scheduledAt: Date.now() - 1000 }
            ]);

            const result = await offlineReconciliation.reconcile();
            expect(result.reconciled).toBe(1);
            expect(result.failed).toBe(0);
        });

        it("counts failed tasks", async () => {
            mockTaskStore.getAll.mockResolvedValue([
                { taskId: "task-1", status: "failed", scheduledAt: Date.now() - 1000 },
                { taskId: "task-2", status: "failed", scheduledAt: Date.now() - 1000 }
            ]);

            const result = await offlineReconciliation.reconcile();
            expect(result.failed).toBe(2);
            expect(result.reconciled).toBe(0);
        });

        it("publishes events for reconciled tasks", async () => {
            mockTaskStore.getDueTasks.mockResolvedValue([
                { taskId: "task-1", status: "pending", scheduledAt: Date.now() - 1000 }
            ]);
            mockTaskStore.getAll.mockResolvedValue([
                { taskId: "task-1", status: "pending", scheduledAt: Date.now() - 1000 }
            ]);

            await offlineReconciliation.reconcile();
            expect(mockEventBus.publish).toHaveBeenCalledWith({
                type: "TASK_DUE",
                payload: { taskId: "task-1", scheduledAt: expect.any(Number) }
            });
        });

        it("publishes events for failed tasks", async () => {
            mockTaskStore.getAll.mockResolvedValue([
                { taskId: "task-1", status: "failed", scheduledAt: Date.now() - 1000 }
            ]);

            await offlineReconciliation.reconcile();
            expect(mockEventBus.publish).toHaveBeenCalledWith({
                type: "TASK_FAILED",
                payload: { taskId: "task-1" }
            });
        });

    });

    describe("hasMissedEvents", () => {

        it("returns true when there are pending due tasks", async () => {
            mockTaskStore.getDueTasks.mockResolvedValue([
                { taskId: "task-1", status: "pending", scheduledAt: Date.now() - 1000 }
            ]);
            expect(await offlineReconciliation.hasMissedEvents()).toBe(true);
        });

        it("returns false when there are no pending due tasks", async () => {
            mockTaskStore.getDueTasks.mockResolvedValue([]);
            expect(await offlineReconciliation.hasMissedEvents()).toBe(false);
        });

        it("returns false when due tasks are not pending", async () => {
            mockTaskStore.getDueTasks.mockResolvedValue([
                { taskId: "task-1", status: "completed", scheduledAt: Date.now() - 1000 }
            ]);
            expect(await offlineReconciliation.hasMissedEvents()).toBe(false);
        });

    });

});
