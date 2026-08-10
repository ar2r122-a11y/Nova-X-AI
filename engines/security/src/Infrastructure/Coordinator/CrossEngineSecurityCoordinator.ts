import type { IEventBus, IDomainEvent, IEventHandler } from "@nova-x-ai/core";
import type { ISecurityEngine } from "../../Contracts";

export class CrossEngineSecurityCoordinator {
    private security: ISecurityEngine | null = null;
    private eventBus: IEventBus | null = null;
    private subscribed = false;

    setSecurity(security: ISecurityEngine): void {
        this.security = security;
    }

    setEventBus(eventBus: IEventBus): void {
        this.eventBus = eventBus;
    }

    async initialize(): Promise<void> {
        if (!this.eventBus || this.subscribed) return;

        const authHandler: IEventHandler<any> = {
            handle: async (event: any) => {
                if (!this.security) return;
                await this.security.authenticateToken(event.token, event.identityId);
            }
        };

        const permHandler: IEventHandler<any> = {
            handle: async (event: any) => {
                if (!this.security) return;
                await this.security.validatePermissions(event.identityId, event.resource, event.action, event.claims);
            }
        };

        this.eventBus.subscribe("REQ_SEC_AuthenticateTokenCommand", authHandler);
        this.eventBus.subscribe("QUE_SEC_ValidatePermissions", permHandler);

        this.subscribed = true;
    }

    async interceptAndValidate(event: IDomainEvent): Promise<boolean> {
        if (!this.security) return true;

        if (event.eventType.startsWith("REQ_") || event.eventType.startsWith("QUE_")) {
            const identityId = (event as any).identityId;
            if (identityId) {
                const sessions = this.security.getSessions();
                const session = sessions.find((s: any) => s.identityId === identityId && s.status === "active");
                return !!session;
            }
        }

        return true;
    }

    isInitialized(): boolean {
        return this.subscribed;
    }
}
