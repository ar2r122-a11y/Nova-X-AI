import { IBackgroundScheduler } from "./IBackgroundScheduler";

export class BackgroundScheduler
implements IBackgroundScheduler {

    private readonly tasks =
        new Map<string, NodeJS.Timeout>();

    private running = false;

    public async start(): Promise<void> {

        this.running = true;

    }

    public async stop(): Promise<void> {

        for (const timer of this.tasks.values()) {
            clearInterval(timer);
        }

        this.tasks.clear();

        this.running = false;

    }

    public schedule(
        name: string,
        task: () => Promise<void>,
        intervalMs: number
    ): void {

        if (this.tasks.has(name)) {
            this.cancel(name);
        }

        const timer = setInterval(async () => {

            if (!this.running) {
                return;
            }

            await task();

        }, intervalMs);

        this.tasks.set(name, timer);

    }

    public cancel(
        name: string
    ): void {

        const timer =
            this.tasks.get(name);

        if (!timer) {
            return;
        }

        clearInterval(timer);

        this.tasks.delete(name);

    }

    public isRunning(): boolean {

        return this.running;

    }

}