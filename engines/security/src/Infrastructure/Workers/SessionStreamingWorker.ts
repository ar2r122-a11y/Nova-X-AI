import type { ISecurityWorker, ISecurityEngine } from "../../Contracts";

export class SessionStreamingWorker implements ISecurityWorker {
    private running = false;
    private security: ISecurityEngine | null = null;

    setSecurity(security: ISecurityEngine): void {
        this.security = security;
    }

    async start(): Promise<void> {
        this.running = true;
        this.stream();
    }

    async stop(): Promise<void> {
        this.running = false;
    }

    isRunning(): boolean {
        return this.running;
    }

    getWorkerName(): string {
        return "SessionStreamingWorker";
    }

    private async stream(): Promise<void> {
        while (this.running) {
            if (!this.security) break;
            const sessions = this.security.getSessions();
            for (const session of sessions) {
                if (session.expiresAt < Date.now() && session.status === "active") {
                    this.security.getAggregate().registerSession({
                        ...session,
                        status: "expired"
                    });
                }
            }
            await new Promise(resolve => setTimeout(resolve, 60000));
        }
    }
}
