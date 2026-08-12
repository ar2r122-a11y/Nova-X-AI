import { ISessionRepository } from "../../Domain/Repositories/ISessionRepository";

export class InMemorySessionRepository implements ISessionRepository {
    private readonly store = new Map<string, {
        sessionId: string;
        conversationId: string;
        state: string;
        createdAt: number;
        lastActivityAt: number;
        metadata: Record<string, unknown>;
    }>();

    async save(session: {
        sessionId: string;
        conversationId: string;
        state: string;
        createdAt: number;
        lastActivityAt: number;
        metadata: Record<string, unknown>;
    }): Promise<void> {
        this.store.set(session.sessionId, session);
    }

    async getById(sessionId: string): Promise<{
        sessionId: string;
        conversationId: string;
        state: string;
        createdAt: number;
        lastActivityAt: number;
        metadata: Record<string, unknown>;
    } | null> {
        return this.store.get(sessionId) || null;
    }

    async getByConversationId(conversationId: string): Promise<Array<{
        sessionId: string;
        conversationId: string;
        state: string;
        createdAt: number;
        lastActivityAt: number;
        metadata: Record<string, unknown>;
    }>> {
        return Array.from(this.store.values()).filter(s => s.conversationId === conversationId);
    }

    async delete(sessionId: string): Promise<void> {
        this.store.delete(sessionId);
    }

    async exists(sessionId: string): Promise<boolean> {
        return this.store.has(sessionId);
    }
}
