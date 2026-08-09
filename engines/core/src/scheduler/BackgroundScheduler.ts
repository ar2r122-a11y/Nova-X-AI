import { IBackgroundScheduler } from "./IBackgroundScheduler";

export class BackgroundScheduler
implements IBackgroundScheduler {

    private readonly tasks = new Map<
        string,
        {
            name: string;
            task: () => Promise<void>;
            intervalMs: number;
            timer: NodeJS.Timeout;
        }
    >();

    private readonly maxWorkers: number;

    private activeWorkers = 0;

    private readonly pendingQueue: Array<
        () => Promise<void>
    > = [];

    private running = false;

    constructor(
        maxWorkers: number = 8
    ) {
        this.maxWorkers = maxWorkers;
    }

    public async start(): Promise<void> {

        this.running = true;

    }

    public async stop(): Promise<void> {

        this.running = false;

        for (const entry of this.tasks.values()) {

            clearInterval(entry.timer);

        }

        this.tasks.clear();

        await this.drain();

    }

    public schedule(
        name: string,
        task: () => Promise<void>,
        intervalMs: number
    ): void {

        if (this.tasks.has(name)) {

            this.cancel(name);

        }

        const timer = setInterval(() => {

            if (!this.running) {

                return;

            }

            this.enqueue(task);

        }, intervalMs);

        this.tasks.set(name, { name, task, intervalMs, timer });

    }

    public cancel(
        name: string
    ): void {

        const entry =
            this.tasks.get(name);

        if (!entry) {

            return;

        }

        clearInterval(entry.timer);

        this.tasks.delete(name);

    }

    public isRunning(): boolean {

        return this.running;

    }

    private enqueue(
        task: () => Promise<void>
    ): void {

        if (this.activeWorkers >= this.maxWorkers) {

            this.pendingQueue.push(task);

            return;

        }

        this.runTask(task);

    }

    private async runTask(
        task: () => Promise<void>
    ): Promise<void> {

        this.activeWorkers++;

        try {

            await task();

        } catch (error) {

            console.error(
                `Background task failed:`,
                error
            );

        } finally {

            this.activeWorkers--;

            this.next();

        }

    }

    private next(): void {

        if (
            this.pendingQueue.length > 0 &&
            this.activeWorkers < this.maxWorkers
        ) {

            const task =
                this.pendingQueue.shift()!;

            this.runTask(task);

        }

    }

    private async drain(): Promise<void> {

        while (this.activeWorkers > 0) {

            await new Promise(
                resolve => setTimeout(resolve, 10)
            );

        }

    }

}